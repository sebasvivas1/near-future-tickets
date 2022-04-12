use crate::*;

// #[cfg(test)]
// mod tests {
//     #[test]
//     fn it_works() {
//         let result = 2 + 2;
//         assert_eq!(result, 4);
//     }
// }

// mod enumeration;
// mod metadata;

// /// This spec can be treated like a version of the standard.
// pub const NFT_METADATA_SPEC: &str = "nft-1.0.0";
// /// This is the name of the NFT standard we're using
// pub const NFT_STANDARD_NAME: &str = "nep171";

// #[near_bindgen]
// #[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
// pub struct Contract {
//     //contract owner
//     pub owner_id: AccountId,

//     //keeps track of all the token IDs for a given account
//     pub tokens_per_owner: LookupMap<AccountId, UnorderedSet<TokenId>>,

//     //keeps track of the token struct for a given token ID
//     pub tokens_by_id: LookupMap<TokenId, Token>,

//     //keeps track of the token metadata for a given token ID
//     pub token_metadata_by_id: UnorderedMap<TokenId, TokenMetadata>,

//     //keeps track of the metadata for the contract
//     pub metadata: LazyOption<NFTContractMetadata>,
// }

use std::collections::HashMap;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::json_types::{Base64VecU8, U128};
use near_contract_standards::non_fungible_token::metadata::{
    NFTContractMetadata, NonFungibleTokenMetadataProvider, TokenMetadata, NFT_METADATA_SPEC,
};
//use near_contract_standards::non_fungible_token::NonFungibleToken;
use near_contract_standards::non_fungible_token::NonFungibleToken;
use near_contract_standards::non_fungible_token::{Token, TokenId};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::{
    env, log, near_bindgen, AccountId, Balance, BorshStorageKey, CryptoHash, PanicOnDefault, Promise, PromiseOrValue,
};


#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    tokens: NonFungibleToken,
    metadata: LazyOption<NFTContractMetadata>,
}

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    NonFungibleToken,
    Metadata,
    TokenMetadata,
    Enumeration,
    Approval,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new_default_meta(owner_id: AccountId) -> Self {
        Self::new_two(
            owner_id,
            NFTContractMetadata {
                spec: NFT_METADATA_SPEC.to_string(),
                name: "Juan Enrique".to_string(),
                symbol: "JEPH".to_string(),
                icon: None,
                base_uri: None,
                reference: None,
                reference_hash: None,
            }
        )
    }

    #[init]
    pub fn new_two(owner_id: AccountId, metadata: NFTContractMetadata) -> Self {
        assert!(!env::state_exists(), "Contract already initialized");
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
        receiver_id: AccountId,
        token_metadata: TokenMetadata,
    ) -> Token {
        self.tokens.internal_mint(token_id, receiver_id, Some(token_metadata))
    }
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct Counter {
    value: u64,
}

#[near_bindgen]
impl Counter {
    #[init]
    pub fn new(value: u64) -> Self {
        log!("Custom counter initialization!");
        Self { value }
    }
    pub fn inc(&mut self) {
        self.value += 1;
    }

    pub fn get(&self) -> u64 {
        self.value
    }
    pub fn set(&mut self, value: u64) {
        self.value = value;
    }
    pub fn show(&self) {
        log!("{}", self.value);
    }
    pub fn show_str(&mut self) -> u64 {
        let ex = self.value * 2;
        self.value = ex;
        self.value
    }
}