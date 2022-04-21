use near_contract_standards::non_fungible_token::NonFungibleToken;
use near_contract_standards::non_fungible_token::Token;
use near_contract_standards::non_fungible_token::TokenId;
use std::collections::HashMap;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::{Base64VecU8, U128, U64};
use near_sdk::serde::{Serialize, Deserialize};
use near_sdk::{ require,
    BorshStorageKey, env, near_bindgen, AccountId, Balance, CryptoHash, PanicOnDefault, Promise,
};


// NFT Standards
use near_contract_standards::non_fungible_token::metadata::{
    NFTContractMetadata, NonFungibleTokenMetadataProvider, TokenMetadata, NFT_METADATA_SPEC,
};
// use crate::internal::*;
pub use crate::metadata::*;
// pub use crate::mint::*;
// pub use crate::approval::*;
// pub use crate::events::*;

// mod internal;
mod metadata;
// mod mint;
// mod approval; 
// mod events;

pub const TITLE_DELIMETER: &str = " - ";

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
    ticket_banners: Vec<String>,
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
}

/// Helper structure for keys of the persistent collections.
#[derive(BorshStorageKey, BorshSerialize)]
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
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new_default_meta(owner_id: AccountId) -> Self {
        Self::new(
            owner_id,
            NFTContractMetadata {
                spec: "nft-1.0.0".to_string(),
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
        metadata.assert_valid();
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
            )
        };
this
    }

    #[payable]
    // Create an Event
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
        //royalty: Option<HashMap<AccountId, u32>>,
     ) -> Event {
        // Actual Ticket types for a given Event
        let caller = env::signer_account_id();
        let index = i128::from(self.events.len() + 1);
        let mut children_token_map = Vec::new();

        let mut metadata = token_metadata;

        for (i, _x) in ticket_type.iter().enumerate() {
            let mut ticket_title = format!("");
            metadata.copies = Some(U64(capacity[i].into()).0);
            metadata.media = Some(ticket_banners[i].clone());
            ticket_title = format!("{:?}{}{}", metadata.title.clone() , TITLE_DELIMETER , ticket_type[i].clone());
            metadata.title = Some(ticket_title.to_string());
            // assert!(ticket_title.is_some(), "token_metadata.title is required");
            // let token_series_id = format!("{}", (children_token_map.len() + 1));
            children_token_map.push(TokenSeriesJson{
                metadata: metadata.clone(),
                creator_id: caller.clone(),
                
            is_mintable: true,
            });
            
            // assert!(
            //     children_token_map.get(&token_series_id).is_none(),
            //     "Duplicate token_series_id"
            // );
        }

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
            ticket_banners: ticket_banners,
        };
        self.events.insert(&event.index, &event);
        event
    }

    // Get All events
    pub fn get_events(self) -> Vec<Event> {
        let event_list = self.events.values_as_vector().to_vec();
        event_list
    }
}
// near_contract_standards::impl_non_fungible_token_core!(Contract, tokens);
// near_contract_standards::impl_non_fungible_token_approval!(Contract, tokens);
// near_contract_standards::impl_non_fungible_token_enumeration!(Contract, tokens);

#[near_bindgen]
impl NonFungibleTokenMetadataProvider for Contract {
    fn nft_metadata(&self) -> NFTContractMetadata {
        self.metadata.get().unwrap()
    }
}