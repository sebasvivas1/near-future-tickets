use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::Serialize;
use near_sdk::serde::Deserealize;
use near_sdk::collections::UnorderedMap;
use near_sdk::{ env, near_bindgen, AccountId, Balance, Promise };
// NFT Standard
use near_contract_standards::non_fungible_token::core::{NonFungibleToken, NonFungibleTokenResolver};
use near_contract_standards::non_fungible_token::metadata::{NFTContractMetadata, NonFungibleTokenMetadataProvider, TokenMetadata, NFT_METADATA_SPEC};
use near_contract_standards::non_fungible_token::NonFungibleToken;
use near_contract_standards::non_fungible_token::{Token, TokenId};

// HashMap import
use std::collections:HashMap;

near_sdk::setup_alloc!();

// Objects
#[derive(Serialize, Deserealize, BorshSerialize, BorshDeserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct UserObject {
    id: String,
    fullName: String,
    events: Vec<Event>,
    organizedEvents: Vec<Event>,
    profile_pic: String,
    description: String,
    tickets: Vec<Ticket>,
}

#[derive(Serialize, Deserealize, BorshSerialize, BorshDeserialize)]
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
    organizer: UserObject,
    attendants: Vec<UserObject>
}


#[derive(Serialize, Deserealize, BorshSerialize, BorshDeserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Ticket {
    token_id: String,
    metadata: TokenMetadata,
    owner_id: AccountId,
    event: Event,
    image: String,
    price: Balance,
    royalty: HashMap<AccountId, u32>
}


// -------- Objects End --------- //

// Storage 
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct NEARFT {
    // users
    pub users: UnorderedMap<AccountId, UserObject>,

    // Events
    pub events: UnorderedMap<i128, Event>,

    // Organized Events (myself)
    pub myEvents: Vec<Event>,

    // Tickets
    pub tickets: Vec<Ticket>,

    // Attendants
    pub attendants: Vec<UserObject>,

}

