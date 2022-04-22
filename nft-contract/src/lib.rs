use near_contract_standards::non_fungible_token::{ NonFungibleToken };
use std::collections::HashMap;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::{Base64VecU8, U128, U64};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, near_bindgen, AccountId, Balance, CryptoHash, PanicOnDefault, Promise, PromiseOrValue, BorshStorageKey, require,
};
use metadata::{ NFTContractMetadata, TokenMetadata };

use crate::internal::*;
pub use crate::metadata::*;
pub use crate::mint::*;
pub use crate::nft_core::*;
pub use crate::approval::*;
pub use crate::royalty::*;
pub use crate::events::*;

mod internal;
mod approval;
mod enumeration;
mod metadata;
mod mint;
mod nft_core;
mod royalty;
mod events;

// Used to delimit Event Title + Ticket Category (eg: Concert - VIP)
pub const TITLE_DELIMETER: &str = " - ";

/// This spec can be treated like a version of the standard.
pub const NFT_METADATA_SPEC: &str = "1.0.0";
/// This is the name of the NFT standard we're using
pub const NFT_STANDARD_NAME: &str = "nep171";

pub type TokenSeriesId = String;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Event {
    name: String,
    description: String,
    modality: u8,
    capacity: Vec<u32>,
    date: String,
    time: u64,
    status: u8,
    index: i128,
    banner: String,
    organizer: AccountId,
    ticket_type: Vec<String>,
    tickets: Vec<TokenSeriesJson>,
}

#[derive(BorshDeserialize, BorshSerialize)]
// #[serde(crate = "near_sdk::serde")]
pub struct TokenSeries {
	metadata: TokenMetadata,
	creator_id: AccountId,
    tokens: UnorderedSet<TokenId>,
    is_mintable: bool,
    // royalty: HashMap<AccountId, u32>,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenSeriesJson {
    token_series_id: TokenSeriesId,
	metadata: TokenMetadata,
	creator_id: AccountId,
    is_mintable: bool,
    // royalty: HashMap<AccountId, u32>,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    tokens: NonFungibleToken,
    //contract owner
    pub owner_id: AccountId,

    //keeps track of all the token IDs for a given account
    pub tokens_per_owner: LookupMap<AccountId, UnorderedSet<TokenId>>,

    //keeps track of the token struct for a given token ID
    pub tokens_by_id: LookupMap<TokenId, Token>,

    //keeps track of the token metadata for a given token ID
    pub token_metadata_by_id: UnorderedMap<TokenId, TokenMetadata>,

    //keeps track of the metadata for the contract
    pub metadata: LazyOption<NFTContractMetadata>,

    // List of created events
    pub events: UnorderedMap<i128, Event>,

    // Stores all created Tickets
    token_series_by_id: UnorderedMap<TokenSeriesId, TokenSeries>,
}

/// Helper structure for keys of the persistent collections.
#[derive(BorshSerialize, BorshStorageKey)]
pub enum StorageKey {
    TokensPerOwner,
    TokenPerOwnerInner { account_id_hash: CryptoHash },
    TokensById,
    TokenMetadataById,
    NFTContractMetadata,
    TokensPerType,
    TokensPerTypeInner { token_type_hash: CryptoHash },
    TokenTypesLocked,
    Events,
    TokensBySeriesInner { token_series : String },
    NonFungibleToken,
    TokenMetadata,
    Enumeration,
    Approval,
    TokenSeriesById,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new_default_meta(owner_id: AccountId) -> Self {
        Self::new(
            owner_id,
            NFTContractMetadata {
                spec: NFT_METADATA_SPEC.to_string(),
                name: "NEAR Future Tickets Marketplace".to_string(),
                symbol: "NEAR Future Tickets".to_string(),
                icon: None,
                base_uri: None,
                reference: None,
                reference_hash: None,
            },
        )
    }

    #[init]
    pub fn new(owner_id: AccountId, metadata: NFTContractMetadata) -> Self {
        require!(!env::state_exists(), "Already initialized");
        let this = Self {
            tokens: NonFungibleToken::new(StorageKey::NonFungibleToken, owner_id.clone(), Some(StorageKey::TokenMetadata), Some(StorageKey::Enumeration), Some(StorageKey::Approval),),
            events: UnorderedMap::new(StorageKey::Events),
            tokens_per_owner: LookupMap::new(StorageKey::TokensPerOwner),
            tokens_by_id: LookupMap::new(StorageKey::TokensById),
            token_metadata_by_id: UnorderedMap::new(
                StorageKey::TokenMetadataById.try_to_vec().unwrap(),
            ),
            owner_id,
            metadata: LazyOption::new(
                StorageKey::NFTContractMetadata.try_to_vec().unwrap(),
                Some(&metadata),
            ),
            token_series_by_id: UnorderedMap::new(StorageKey::TokenSeriesById),
        };
this
    }

    #[payable]
    // Create an Event and Tickets Structure with their respective capacity (copies)
    pub fn create_event(&mut self,
        token_metadata: TokenMetadata,
        name: String,
        description: String,
        modality: u8,
        capacity: Vec<u32>,
        date: String,
        time: u64,
        status: u8,
        banner: String,
        ticket_type: Vec<String>,
        ticket_banners: Vec<String>,
        // royalty: Option<HashMap<AccountId, u32>>,
     ) -> Event {
        // Initial storage usage
        let initial_storage_usage = env::storage_usage();
        let caller = env::signer_account_id();
        let index = i128::from(self.events.len() + 1);
        let mut children_token_map = Vec::new();
        let mut metadata = token_metadata;

        for (i, _x) in ticket_type.iter().enumerate() {

            let token_series_id = format!("{}", (self.token_series_by_id.len() + 1));

            let title = name.clone();
            metadata.copies = Some(U64(capacity[i].into()).0);
            metadata.media = Some(ticket_banners[i].clone());
            let ticket_title = format!("{:?}{}{}", &title , TITLE_DELIMETER , ticket_type[i].clone());
            metadata.title = Some(ticket_title.to_string());

            self.token_series_by_id.insert(&token_series_id, &TokenSeries{
                metadata: metadata.clone(),
                creator_id: caller.clone(),
                tokens: UnorderedSet::new(
                    StorageKey::TokensBySeriesInner {
                        token_series: token_series_id.clone(),
                    }
                    .try_to_vec()
                    .unwrap(),
                ),
                is_mintable: true,
            });

            children_token_map.push(TokenSeriesJson{
                metadata: metadata.clone(),
                creator_id: caller.clone(),
                is_mintable: true,
                token_series_id,
            });
        }
        // refund_deposit(initial_storage_usage);

        let event = Event {
            name: name,
            description: description,
            modality: modality,
            date: date,
            time: time,
            status: status,
            index: index,
            banner: banner,
            capacity: capacity,
            organizer: caller,
            ticket_type: ticket_type,
            tickets: children_token_map,
        };
        self.events.insert(&event.index, &event);
        event
    }

    // Get All events
    pub fn get_events(self) -> Vec<Event> {
        let event_list = self.events.values_as_vector().to_vec();
        event_list
    }

    // Get Tickets
    pub fn get_event_tickets(
        &self,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<TokenSeriesJson> {
        let start_index: u128 = from_index.map(From::from).unwrap_or_default();
        assert!(
            (self.token_series_by_id.len() as u128) > start_index,
            "Out of bounds, please use a smaller from_index."
        );
        let limit = limit.map(|v| v as usize).unwrap_or(usize::MAX);
        assert_ne!(limit, 0, "Cannot provide limit of 0.");

        self.token_series_by_id
            .iter()
            .skip(start_index as usize)
            .take(limit)
            .map(|(token_series_id, token_series)| TokenSeriesJson{
                token_series_id,
                metadata: token_series.metadata,
                creator_id: token_series.creator_id,
                is_mintable: token_series.is_mintable,
            })
            .collect()
    }
}