use crate::*;

#[near_bindgen]
impl Contract {
    /// views
    
    //returns the number of sales the marketplace has up (as a string)
    pub fn get_supply_sales(
        &self,
    ) -> U64 {
        //returns the sales object length wrapped as a U64
        U64(self.sales.len())
    }
    
    //returns the number of sales for a given account (result is a string)
    pub fn get_supply_by_owner_id(
        &self,
        account_id: AccountId,
    ) -> U64 {
        //get the set of sales for the given owner Id
        let by_owner_id = self.by_owner_id.get(&account_id);
        
        //if there as some set, we return the length but if there wasn't a set, we return 0
        if let Some(by_owner_id) = by_owner_id {
            U64(by_owner_id.len())
        } else {
            U64(0)
        }
    }

    //returns paginated sale objects for a given account. (result is a vector of sales)
    pub fn get_sales_by_owner_id(
        &self,
        account_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<Sale> {
        //get the set of token IDs for sale for the given account ID
        let by_owner_id = self.by_owner_id.get(&account_id);
        //if there was some set, we set the sales variable equal to that set. If there wasn't, sales is set to an empty vector
        let sales = if let Some(by_owner_id) = by_owner_id {
            by_owner_id
        } else {
            return vec![];
        };
        
        //we'll convert the UnorderedSet into a vector of strings
        let keys = sales.as_vector();

        //where to start pagination - if we have a from_index, we'll use that - otherwise start from 0 index
        let start = u128::from(from_index.unwrap_or(U128(0)));
        
        //iterate through the keys vector
        keys.iter()
            //skip to the index we specified in the start variable
            .skip(start as usize) 
            //take the first "limit" elements in the vector. If we didn't specify a limit, use 0
            .take(limit.unwrap_or(0) as usize) 
            //we'll map the token IDs which are strings into Sale objects
            .map(|token_id| self.sales.get(&token_id).unwrap())
            //since we turned the keys into an iterator, we need to turn it back into a vector to return
            .collect()
    }

    //get the number of sales for an nft contract. (returns a string)
    pub fn get_supply_by_nft_contract_id(
        &self,
        nft_contract_id: AccountId,
    ) -> U64 {
        //get the set of tokens for associated with the given nft contract
        let by_nft_contract_id = self.by_nft_contract_id.get(&nft_contract_id);
        
        //if there was some set, return it's length. Otherwise return 0
        if let Some(by_nft_contract_id) = by_nft_contract_id {
            U64(by_nft_contract_id.len())
        } else {
            U64(0)
        }
    }

    //returns paginated sale objects associated with a given nft contract. (result is a vector of sales)
    pub fn get_sales_by_nft_contract_id(
        &self,
        nft_contract_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<Sale> {
        //get the set of token IDs for sale for the given contract ID
        let by_nft_contract_id = self.by_nft_contract_id.get(&nft_contract_id);
        
        //if there was some set, we set the sales variable equal to that set. If there wasn't, sales is set to an empty vector
        let sales = if let Some(by_nft_contract_id) = by_nft_contract_id {
            by_nft_contract_id
        } else {
            return vec![];
        };

        //we'll convert the UnorderedSet into a vector of strings
        let keys = sales.as_vector();

        //where to start pagination - if we have a from_index, we'll use that - otherwise start from 0 index
        let start = u128::from(from_index.unwrap_or(U128(0)));
        
        //iterate through the keys vector
        keys.iter()
            //skip to the index we specified in the start variable
            .skip(start as usize) 
            //take the first "limit" elements in the vector. If we didn't specify a limit, use 0
            .take(limit.unwrap_or(0) as usize) 
            //we'll map the token IDs which are strings into Sale objects by passing in the unique sale ID (contract + DELIMITER + token ID)
            .map(|token_id| self.sales.get(&format!("{}{}{}", nft_contract_id, DELIMETER, token_id)).unwrap())
            //since we turned the keys into an iterator, we need to turn it back into a vector to return
            .collect()
    }

    pub fn get_sales_by_event_date(
        &self,
        event_date: String,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<Sale> {
        let by_event_date = self.by_event_date.get(&event_date);
        let sales = if let Some(by_event_date) = by_event_date {
            by_event_date
        } else {
            return vec![];
        };
        let keys = sales.as_vector();
        let start = u128::from(from_index.unwrap_or(U128(0)));
        keys.iter()
            .skip(start as usize)
            .take(limit.unwrap_or(0) as usize)
            .map(|token_id| self.sales.get(&token_id).unwrap())
            .collect()
    }

    pub fn get_sales_by_event_country(
        &self,
        event_country: String,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<Sale> {
        let by_event_country = self.by_event_country.get(&event_country);
        let sales = if let Some(by_event_country) = by_event_country {
            by_event_country
        } else {
            return vec![];
        };
        let keys = sales.as_vector();
        let start = u128::from(from_index.unwrap_or(U128(0)));
        keys.iter()
            .skip(start as usize)
            .take(limit.unwrap_or(0) as usize)
            .map(|token_id| self.sales.get(&token_id).unwrap())
            .collect()
    }

    pub fn get_sales_by_event_modality(
        &self,
        event_modality: u8,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<Sale> {
        let by_event_modality = self.by_event_modality.get(&event_modality);
        let sales = if let Some(by_event_modality) = by_event_modality {
            by_event_modality
        } else {
            return vec![];
        };
        let keys = sales.as_vector();
        let start = u128::from(from_index.unwrap_or(U128(0)));
        keys.iter()
            .skip(start as usize)
            .take(limit.unwrap_or(0) as usize)
            .map(|token_id| self.sales.get(&token_id).unwrap())
            .collect()
    }

    pub fn get_sales_by_event_date_country_modality(
        &self,
        event_date: Option<String>,
        event_country: Option<String>,
        event_modality: Option<u8>,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<Sale> {
        //1 Solo Event_Date //2 Solo Event_Country //3 Solo Event_Modality 
        //4 Event_Date + Event_Country //5 Event_Date + Event_Modality 
        //6 Event_Country + Event_Modality //7 Event_Date + Event_Country + Event_Modality
        let mut query_type_date = false;
        let mut query_type_country = false;
        let mut query_type_modality = false;

        if let Some(event_date) = &event_date {
            query_type_date = true;
        } else if let Some(event_country) = &event_country {
            query_type_country = true;
        } else if let Some(event_modality) = &event_modality {
            query_type_modality = true;
        }

        let mut query_type_date_country = false;
        let mut query_type_date_modality = false;
        let mut query_type_country_modality = false;
        let mut query_type_date_country_modality = false;

        if (query_type_date && query_type_country) {
            query_type_date_country = true;
            query_type_date = false;
            query_type_country = false;
        } else if (query_type_date && query_type_modality) {
            query_type_date_modality = true;
            query_type_date = false;
            query_type_modality = false;
        } else if (query_type_country && query_type_modality) {
            query_type_country_modality = true;
            query_type_country = false;
            query_type_modality = false;
        } else if (query_type_date && query_type_country && query_type_modality) {
            query_type_date_country_modality = true;
            query_type_date = false;
            query_type_country = false;
            query_type_modality = false;
        }

        let mut preliminar_sales: Vec<Sale> = vec![];
        if (query_type_date && !query_type_country && !query_type_modality) {
            if let Some(event_date) = &event_date {
                let by_event_date = self.by_event_date.get(&event_date);
                let sales = if let Some(by_event_date) = by_event_date {
                 by_event_date
                } else {
                    return vec![];
                };
                let keys = sales.as_vector();
                let start = u128::from(from_index.unwrap_or(U128(0)));
                preliminar_sales = keys.iter()
                    .skip(start as usize)
                    .take(limit.unwrap_or(0) as usize)
                    .map(|token_id| self.sales.get(&token_id).unwrap())
                    .collect()
            }
        } else if (query_type_country && !query_type_date && !query_type_modality) {
            if let Some(event_country) = &event_country {
                let by_event_country = self.by_event_country.get(&event_country);
                let sales = if let Some(by_event_country) = by_event_country {
                    by_event_country
                } else {
                    return vec![];
                };
                let keys = sales.as_vector();
                let start = u128::from(from_index.unwrap_or(U128(0)));
                preliminar_sales = keys.iter()
                    .skip(start as usize)
                    .take(limit.unwrap_or(0) as usize)
                    .map(|token_id| self.sales.get(&token_id).unwrap())
                    .collect()
            }
        } else if (query_type_modality && !query_type_date && !query_type_country) {
            if let Some(event_modality) = &event_modality {
                let by_event_modality = self.by_event_modality.get(&event_modality);
                let sales = if let Some(by_event_modality) = by_event_modality {
                    by_event_modality
                } else {
                    return vec![];
                };
                let keys = sales.as_vector();
                let start = u128::from(from_index.unwrap_or(U128(0)));
                preliminar_sales = keys.iter()
                    .skip(start as usize)
                    .take(limit.unwrap_or(0) as usize)
                    .map(|token_id| self.sales.get(&token_id).unwrap())
                    .collect()
            }
        } else if (query_type_date_country && !query_type_date_modality && !query_type_country_modality) {
            if let Some(event_date) = &event_date {
                if let Some(event_country) = &event_country {
                    let by_event_date = self.by_event_date.get(&event_date);
                    let sales_one = if let Some(by_event_date) = by_event_date {
                        by_event_date
                    } else {
                        return vec![];
                    };
                    let keys = sales_one.as_vector();
                    let start = u128::from(from_index.unwrap_or(U128(0)));
                    let mut preliminar_sales_one: Vec<Sale> = keys.iter()
                        .skip(start as usize)
                        .take(limit.unwrap_or(0) as usize)
                        .map(|token_id| self.sales.get(&token_id).unwrap())
                        .collect();

                    let by_event_country = self.by_event_country.get(&event_country);
                    let sales_two = if let Some(by_event_country) = by_event_country {
                        by_event_country
                    } else {
                        return vec![];
                    };
                    let keys = sales_two.as_vector();
                    let start = u128::from(from_index.unwrap_or(U128(0)));
                    let mut preliminar_sales_two: Vec<Sale> = keys.iter()
                        .skip(start as usize)
                        .take(limit.unwrap_or(0) as usize)
                        .map(|token_id| self.sales.get(&token_id).unwrap())
                        .collect();

                    for (i, x) in preliminar_sales_one.iter().enumerate() {
                        for (j, y) in preliminar_sales_two.iter().enumerate() {
                            if *x.token_id == *y.token_id {
                                preliminar_sales.push(x.clone());
                            }
                        }
                    }
                }
            }
        }

        return preliminar_sales;
    }

    //get a sale information for a given unique sale ID (contract + DELIMITER + token ID)
    pub fn get_sale(&self, nft_contract_token: ContractAndTokenId) -> Option<Sale> {
        //try and get the sale object for the given unique sale ID. Will return an option since
        //we're not guaranteed that the unique sale ID passed in will be valid.
        self.sales.get(&nft_contract_token)
    }
}
