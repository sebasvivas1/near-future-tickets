use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::Serialize;
use near_sdk::serde::Deserialize;
use near_sdk::collections::UnorderedMap;
use near_sdk::{ env, near_bindgen, AccountId, Balance, Promise};

// NFT Standards
use near_contract_standards::non_fungible_token::metadata::{
    NFTContractMetadata, NonFungibleTokenMetadataProvider, TokenMetadata, NFT_METADATA_SPEC,
};

use near_contract_standards::non_fungible_token::NonFungibleToken;
use near_contract_standards::non_fungible_token::{Token, TokenId};

// HashMap import
use std::collections::HashMap;

near_sdk::setup_alloc!();

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

// #[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
// #[serde(crate = "near_sdk::serde")]
// pub struct Ticket {
//     tokens: NonFungibleToken,
//     metadata: LazyOption<NFTContractMetadata>,
// }

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

impl Default for NEARFT {
    fn default() -> Self {
        Self {
            users: UnorderedMap::new(b"a"),
            events: UnorderedMap::new(b"b"),
        }
    }
}

#[near_bindgen]
impl NEARFT {
    // Log user on the app, create a new user if it doesn't exist.
    pub fn login(&mut self) -> User {
        let caller = env::signer_account_id().to_string();
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
        assert!(self.users.get(&user_id).is_none(), "User Doesnt Exist!");
        let user = self.users.get(&user_id).unwrap();
        user
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
        let caller = env::signer_account_id().to_string();
        let organizer = self.users.get(&caller);
        let index = i128::from(self.events.len() + 1);
        let update_organizer = organizer.unwrap();
        let organized_events_len = update_organizer.organized_events.len() + 1;
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
        self.events.insert(&event.index, &event);
        // update_organizer.organized_events.insert(organized_events_len, event);
        event
    }

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
    //     let event_list = self.events.
    // }
}
