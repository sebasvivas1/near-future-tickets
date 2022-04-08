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
#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Event {
    id: String,
    name: String,
    description: String,
    modality: u8,
    capacity: u32,
    date: u64,
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
    // Log user on the app, create a new user if it doesnt exist.
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

    pub fn get_users(self) -> Vec<User> {
        let users = self.users.values_as_vector().to_vec();
        users
    }

}
