use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::Serialize;
use near_sdk::serde::Deserialize;
use near_sdk::collections::{UnorderedMap, LazyOption};
use near_sdk::{ env, near_bindgen, AccountId, Balance, Promise, PanicOnDefault, require, BorshStorageKey, PromiseOrValue};

// NFT Standards
use near_contract_standards::non_fungible_token::metadata::{
    NFTContractMetadata, NonFungibleTokenMetadataProvider, TokenMetadata, NFT_METADATA_SPEC,
};

use near_contract_standards::non_fungible_token::NonFungibleToken;
use near_contract_standards::non_fungible_token::{Token, TokenId};

// HashMap import
use std::collections::HashMap;


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

// Creo que falta algo de ticket ???

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
                symbol: "NFT".to_string(),
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
        }
    }

    #[payable]
    pub fn nft_mint(
        &mut self,
        token_id: TokenId,
        token_owner_id: AccountId,
        token_metadata: TokenMetadata,
    ) -> Token {
        self.tokens.internal_mint(token_id, token_owner_id, Some(token_metadata))
    }
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
