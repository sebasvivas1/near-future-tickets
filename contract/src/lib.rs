//use near_sdk::json_types::ValidAccountId;
use near_sdk::collections::UnorderedSet;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::Serialize;
use near_sdk::serde::Deserialize;
use near_sdk::collections::{UnorderedMap, LazyOption};
use near_sdk::{ env, near_bindgen, AccountId, Balance, Promise, PanicOnDefault, require, BorshStorageKey, PromiseOrValue, serde_json::json};
use near_sdk::env::is_valid_account_id;

// NFT Standards
use near_contract_standards::non_fungible_token::metadata::{
    NFTContractMetadata, NonFungibleTokenMetadataProvider, TokenMetadata, NFT_METADATA_SPEC,
};

use near_contract_standards::non_fungible_token::NonFungibleToken;
use near_contract_standards::non_fungible_token::{Token, TokenId};

// HashMap import
use std::collections::HashMap;

pub type TokenSeriesId = String;

const MAX_PRICE: Balance = 1_000_000_000 * 10u128.pow(24);
pub const TOKEN_DELIMITER: &str = " :";
pub const TITLE_DELIMETER: &str = " #";

// Objects
#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct User {
    id: String,
    full_name: String,
    events: Vec<Event>,
    organized_events: Vec<Event>,
    profile_pic:String,
    description: String,
    // tickets: Vec<Ticket>,
}
#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Event {
    name: String,
    description: String,
    modality: u8,
    capacity: u32,
    date: String,
    time: u64,
    status: u8,
    index: i128,
    banner: String,
    organizer: AccountId
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct TokenSeries {
	metadata: TokenMetadata,
	creator_id: AccountId,
	tokens: UnorderedSet<TokenId>,
    price: Option<Balance>,
    is_mintable: bool,
    royalty: HashMap<AccountId, u32>,
    // modality: u8,
    // capacity: u32,
    // date: String,
    // time: u64,
    // status: u8,
    // banner: String,
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenSeriesJson {
    token_series_id: TokenSeriesId,
	metadata: TokenMetadata,
	creator_id: AccountId,
    royalty: HashMap<AccountId, u32>,
    // modality: u8,
    // capacity: u32,
    // date: String,
    // time: u64,
    // status: u8,
    // banner: String,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Market {
    token_series_id: TokenSeriesId,
    metadata: TokenMetadata,
    owner_id: AccountId,
    creator_id: AccountId,
    price: Balance,
    royalty: HashMap<AccountId, u32>,
    copy: i64,
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct MarketJson {
    token_series_id: TokenSeriesId,
    metadata: TokenMetadata,
    owner_id: AccountId,
    creator_id: AccountId,
    price: Balance,
    royalty: HashMap<AccountId, u32>,
}

// -------- Objects End --------- //

// Storage
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct NEARFT {
    // users
    pub users: UnorderedMap<AccountId, User>,
    // Events
    pub events: UnorderedMap<i128, Event>,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    // NFT (Ticket)
    tokens: NonFungibleToken,
    metadata: LazyOption<NFTContractMetadata>,
    token_series_by_id: UnorderedMap<TokenSeriesId, TokenSeries>,
    marketplace: UnorderedMap<TokenSeriesId, MarketJson>
}

impl Default for NEARFT {
    fn default() -> Self {
        Self {
            users: UnorderedMap::new(b"a"),
            events: UnorderedMap::new(b"b"),
        }
    }
}

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    NonFungibleToken,
    Metadata,
    TokenMetadata,
    Enumeration,
    Approval,
    TokenSeriesById,
    TokensBySeriesInner { token_series: String },
    TokensPerOwner { account_hash: Vec<u8>},
}

const DATA_IMAGE_SVG_NEAR_ICON: &str = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 288 288'%3E%3Cg id='l' data-name='l'%3E%3Cpath d='M187.58,79.81l-30.1,44.69a3.2,3.2,0,0,0,4.75,4.2L191.86,103a1.2,1.2,0,0,1,2,.91v80.46a1.2,1.2,0,0,1-2.12.77L102.18,77.93A15.35,15.35,0,0,0,90.47,72.5H87.34A15.34,15.34,0,0,0,72,87.84V201.16A15.34,15.34,0,0,0,87.34,216.5h0a15.35,15.35,0,0,0,13.08-7.31l30.1-44.69a3.2,3.2,0,0,0-4.75-4.2L96.14,186a1.2,1.2,0,0,1-2-.91V104.61a1.2,1.2,0,0,1,2.12-.77l89.55,107.23a15.35,15.35,0,0,0,11.71,5.43h3.13A15.34,15.34,0,0,0,216,201.16V87.84A15.34,15.34,0,0,0,200.66,72.5h0A15.35,15.35,0,0,0,187.58,79.81Z'/%3E%3C/g%3E%3C/svg%3E";

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new_default_meta(owner_id: AccountId) -> Self {
        Self::new(
            owner_id,
            NFTContractMetadata {
                spec: NFT_METADATA_SPEC.to_string(),
                name: "near-future-tickets".to_string(),
                symbol: "NEAR Future Ticket".to_string(),
                icon: Some(DATA_IMAGE_SVG_NEAR_ICON.to_string()),
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
        Self {
            tokens: NonFungibleToken::new(
                StorageKey::NonFungibleToken,
                owner_id,
                Some(StorageKey::TokenMetadata),
                Some(StorageKey::Enumeration),
                Some(StorageKey::Approval),
            ),
            metadata: LazyOption::new(StorageKey::Metadata, Some(&metadata)),
            token_series_by_id: UnorderedMap::new(StorageKey::TokenSeriesById),
            marketplace: UnorderedMap::new(b"0".to_vec()),
        }
    }

    #[payable]
    pub fn nft_mint(
        &mut self,
        token_id: TokenId,
        token_owner_id: AccountId,
        token_metadata: TokenMetadata,
        //perpetual_royalties: Option<HashMap<AccountId, u32>>,
    ) -> Token {
        self.tokens.internal_mint(token_id, token_owner_id, Some(token_metadata))
    }

    #[payable]
    pub fn nft_create_series(
        &mut self,
        creator_id: Option<AccountId>,
        token_metadata: TokenMetadata,
        price: Option<u128>,
        royalty: Option<HashMap<AccountId, u32>>,
        modality: Option<u8>,
        capacity: Option<u32>,
        date: Option<String>,
        time: Option<u64>,
        status: Option<u8>,
        banner: Option<String>,
    ) -> TokenSeriesJson {
        let initial_storage_usage = env::storage_usage();
        let caller_id = env::signer_account_id();


        let old_metadata = token_metadata;

        let new_metadata = join_token_metadata(
            old_metadata,
            modality,
            capacity,
            date,
            time,
            status,
            banner,
        );

        if creator_id.is_some() {
            assert_eq!(creator_id.unwrap(), caller_id, "Caller is not creator_id");
        }

        let token_series_id = format!("{}", (self.token_series_by_id.len() + 1));

        assert!(
            self.token_series_by_id.get(&token_series_id).is_none(),
            "Duplicate token_series_id"
        );

        let title = new_metadata.title.clone();
        assert!(title.is_some(), "token_metadata.title is required");


        let mut total_perpetual = 0;
        let mut total_accounts = 0;
        let royalty_res: HashMap<AccountId, u32> = if let Some(royalty) = royalty {
            for (k , v) in royalty.iter() {
                if !is_valid_account_id(k.as_bytes()) {
                    env::panic_str("Not valid account_id for royalty");
                };
                total_perpetual += *v;
                total_accounts += 1;
            }
            royalty
        } else {
            HashMap::new()
        };

        assert!(total_accounts <= 10, "Royalty exceeds 10 accounts");

        assert!(
            total_perpetual <= 9000,
            "Exceeds maximum royalty -> 9000",
        );


        //TODO: JEPH - Revisar si usar esta función en lugar de stringify
        let price_res: Option<u128> = if price.is_some() {
            assert!(
                price.unwrap() < MAX_PRICE,
                "Price higher than {}",
                MAX_PRICE
            );
            Some(price.unwrap())
        } else {
            None
        };

        self.token_series_by_id.insert(&token_series_id, &TokenSeries{
            metadata: new_metadata.clone(),
            creator_id: caller_id.clone(),
            tokens: UnorderedSet::new(
                StorageKey::TokensBySeriesInner {
                    token_series: token_series_id.clone(),
                }
                .try_to_vec()
                .unwrap(),
            ),
            price: price_res,
            is_mintable: true,
            royalty: royalty_res.clone(),
            // banner: banner.clone(),
            // capacity: capacity.clone(),
            // modality: modality.clone(),
            // status: status.clone(),
            // date: date.clone(),
            // time: time,
        });

        env::log_str(
            stringify!(({
                "type": "nft_create_series",
                "params": {
                    "token_series_id": token_series_id.unwrap(),
                    "token_metadata": token_metadata.unwrap(),
                    "creator_id": caller_id.unwrap(),
                    "price": price.unwrap(),
                    "royalty": royalty_res.unwrap()
                }
            }))
        );

        refund_deposit(env::storage_usage() - initial_storage_usage, 0);

		TokenSeriesJson{
            token_series_id,
			metadata: new_metadata,
			creator_id: caller_id.into(),
            royalty: royalty_res,
            // banner: banner,
            // capacity: capacity,
            // modality: modality,
            // status: status,
            // date: date,
            // time: time,
		}
    }

    fn _nft_mint_series(
        &mut self,
        token_series_id: TokenSeriesId,
        receiver_id: AccountId
    ) -> TokenId {
        let mut token_series = self.token_series_by_id.get(&token_series_id).expect("Token series not exist");
        assert!(
            token_series.is_mintable,
            "Token series is not mintable"
        );

        let num_tokens = token_series.tokens.len();
        let max_copies = token_series.metadata.copies.unwrap_or(u64::MAX);

        assert!(num_tokens < max_copies, "Series supply maxed");

        if (num_tokens + 1) >= max_copies {
            token_series.is_mintable = false;
            // token_series.price = None;
            // self.marketplace.remove(&token_series_id);
        }

        let token_id = format!("{}{}{}", &token_series_id, TOKEN_DELIMITER, num_tokens + 1);
        token_series.tokens.insert(&token_id);
        self.token_series_by_id.insert(&token_series_id, &token_series);
        let title: String = format!("{}{}{}{}{}", token_series.metadata.title.unwrap().clone(), TITLE_DELIMETER, &token_series_id, TITLE_DELIMETER, (num_tokens + 1).to_string());


        let metadata = TokenMetadata {
            title: Some(title),
            description: token_series.metadata.description.clone(),
            media: token_series.metadata.media.clone(),
            media_hash: token_series.metadata.media_hash,
            copies: token_series.metadata.copies,
            issued_at: Some(env::block_timestamp().to_string()),
            expires_at: token_series.metadata.expires_at,
            starts_at: token_series.metadata.starts_at,
            updated_at: token_series.metadata.updated_at,
            //TODO: Los parametros extra van aquí, pero en JSON String
            extra: token_series.metadata.extra.clone(),
            reference: token_series.metadata.reference.clone(),
            reference_hash: token_series.metadata.reference_hash,
        };

        let owner_id: AccountId = receiver_id;
        self.tokens.owner_by_id.insert(&token_id, &owner_id);

        self.tokens
            .token_metadata_by_id
            .as_mut()
            .and_then(|by_id| by_id.insert(&token_id, &metadata));

         if let Some(tokens_per_owner) = &mut self.tokens.tokens_per_owner {
             let mut token_ids = tokens_per_owner.get(&owner_id).unwrap_or_else(|| {
                 UnorderedSet::new(StorageKey::TokensPerOwner {
                     account_hash: env::sha256(&owner_id.as_bytes()),
                 })
             });
             token_ids.insert(&token_id);
             tokens_per_owner.insert(&owner_id, &token_ids);
         };

        token_id
    }
}

fn refund_deposit(storage_used: u64, extra_spend: Balance) {
        let required_cost = env::storage_byte_cost() * Balance::from(storage_used);
        let attached_deposit = env::attached_deposit() - extra_spend;

        assert!(
            required_cost <= attached_deposit,
            "Must attach {} yoctoNEAR to cover storage",
            required_cost,
        );

        let refund = attached_deposit - required_cost;
        if refund > 1 {
            Promise::new(env::predecessor_account_id()).transfer(refund);
        }
    }

    pub fn join_token_metadata(
        old_token_metadata: TokenMetadata,
        modality: Option<u8>,
        capacity: Option<u32>,
        date: Option<String>,
        time: Option<u64>,
        //location: Option<String>,
        status: Option<u8>,
        banner: Option<String>,
    ) -> TokenMetadata {
        let mut old = old_token_metadata;
        //old.extra = old.title;
        //let mut new_extra = String::from("");
        let new_struct = json!({
            "type": "nft_create_series",
            "params": {
                "modality": format!("{}", modality.unwrap_or(0)),
                "capacity": format!("{}", capacity.unwrap_or(1000)),
                "date": format!("{}", date.unwrap_or("".to_string())),
                "time": format!("{}", time.unwrap_or(0)),
                "status": format!("{}", status.unwrap_or(1)),
                "banner": format!("{}", banner.unwrap_or("".to_string())),
            }
        });
        old.extra = Some(new_struct.to_string());
        old
    }

near_contract_standards::impl_non_fungible_token_core!(Contract, tokens);
near_contract_standards::impl_non_fungible_token_approval!(Contract, tokens);
near_contract_standards::impl_non_fungible_token_enumeration!(Contract, tokens);

#[near_bindgen]
impl NonFungibleTokenMetadataProvider for Contract {
    fn nft_metadata(&self) -> NFTContractMetadata {
        self.metadata.get().unwrap()
    }
}

#[near_bindgen]
impl NEARFT {
    // Log user on the app, create a new user if it doesn't exist.
    pub fn login(&mut self) -> User {
        let caller = env::signer_account_id();
        if self.users.get(&caller).is_none() {
            let user = User {
                id: env::signer_account_id().to_string(),
                events: Vec::new(),
                organized_events: Vec::new(),
                full_name: env::signer_account_id().to_string(),
                profile_pic: String::from(""),
                description: String::from(""),
            };
            self.users.insert(&caller, &user);
        }
        let current_user = self.users.get(&caller);
        current_user.unwrap()
    }

    // Get all users registered in the app
    pub fn get_users(self) -> Vec<User> {
        let users = self.users.values_as_vector().to_vec();
        users
    }

    // Get One User given its account id
    pub fn get_user(self, user_id: AccountId) -> User {
        assert!(self.users.get(&user_id).is_some(), "User Doesn't Exist!");
        let user = self.users.get(&user_id).unwrap();
        user
    }

    // Update User data (caller update its own data)
    pub fn update_user(&mut self, full_name: String, profile_pic: String, description: String) -> User {
        let caller = env::signer_account_id();
        assert!(self.users.get(&caller).is_some(), "User doesn't Exist!");
        let mut user = self.users.get(&caller).unwrap();
        user.full_name = full_name;
        user.profile_pic = profile_pic;
        user.description = description;
        env::log_str("User Updated");
        self.users.insert(&caller, &user);
        let new_user = self.users.get(&caller).unwrap();
        new_user
    }

    // Create an Event
    pub fn create_event(&mut self,
        name: String,
        description: String,
        modality: u8,
        capacity: u32,
        date: String,
        time: u64,
        status: u8,
        banner: String
     ) -> Event {
        let caller = env::signer_account_id();
        let index = i128::from(self.events.len() + 1);
        let organizer = self.users.get(&caller);
        // let organized_events_len = update_organizer.organized_events.len() + 1;
        let event = Event {
            organizer: caller,
            index: index,
            name: name,
            description: description,
            modality: modality,
            capacity: capacity,
            date: date,
            time: time,
            status: status,
            banner: banner
        };
        let mut update_organizer = organizer.unwrap();
        let signer = env::signer_account_id();
        self.events.insert(&event.index, &event);
        update_organizer.organized_events.push(event.clone());
        self.users.insert(&signer, &update_organizer);
        // update_organized_events(&caller, event.clone());
        event
    }

    // Update organized Events of signer user
    // pub fn update_organized_events(&mut self, user_id: AccountId, event: Event) -> User {
    //     let mut owner = self.users.get(&user_id).unwrap();
    //     owner.organized_events.push(&event);
    //     self.users.insert(&user_id, &owner);
    //     let data = self.users.get(&user_id).unwrap();
    //     data
    // }

    // Get All events
    pub fn get_events(self) -> Vec<Event> {
        let event_list = self.events.values_as_vector().to_vec();
        event_list
    }

    // Get one event by ID
    pub fn get_event(self, event_id: i128) -> Event {
        assert!((event_id <= i128::from(self.events.len() + 1)), "Invalid Event ID");
        let event = self.events.get(&event_id);
        event.unwrap()
    }

    // Get all events of one organizer
    // pub fn get_organizer_events(self, organizer: AccountId) -> Vec<Event> {
    //     assert!(self.users.get(&organizer).is_some(), "User doesn't exist");
    //     let event_list = self.events.iter().find(|x| x.organizer == organizer.to_string());
    //     event_list
    // }
}
