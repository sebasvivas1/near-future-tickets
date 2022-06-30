use crate::*;

pub trait Confirm {
    fn confirm_assistance(&mut self, token_id: String) -> bool;
    fn check_assistance(&self, token_id: String) -> Option<String>;
}

pub (crate) fn might_extra(token: &TokenMetadata) -> String {
        let extra = token.extra.clone();
        match extra {
            Some(extra) => {
                return extra
            }
            None => {
                return "".to_string()
            }
        }
}

#[near_bindgen]
impl Confirm for Contract {
    fn confirm_assistance(&mut self, token_id: String) -> bool {
        let event_id = &token_id.split_ascii_whitespace().collect::<Vec<&str>>()[0].parse::<i128>().unwrap();
        let event: Event = self.events.get(event_id).expect("Event not found");
        require!(env::signer_account_id() == event.organizer, "You are not the organizer");

        let token: TokenMetadata = self.token_metadata_by_id.get(&token_id).expect("Token should exist");
        let mut e: Extra = near_sdk::serde_json::from_str(&token.extra.clone().unwrap()).unwrap();
        require!(e.confirmed == false, "Event already confirmed");
        e.confirmed = true;
        let extra = near_sdk::serde_json::to_string(&e).unwrap();
        let mut token: TokenMetadata = self.token_metadata_by_id.get(&token_id).expect("Token should exist");
        token.extra = Some(extra);
        self.token_metadata_by_id.insert(&token_id, &token);
        //require!(env::signer_account_id() == &token.owner_id )
        return e.confirmed;
    }

    fn check_assistance(&self, token_id: String) -> Option<String> {
        // let event_id = &token_id.split_ascii_whitespace().collect::<Vec<&str>>()[0].parse::<i128>().unwrap();
        // env::log_str(&format!("{}", event_id));
        //let event_id: i128 = event_id.parse::<i128>().unwrap();
        //env::log_str(&format!("{}", event_id));

        let token = self.token_metadata_by_id.get(&token_id).expect("Token should exist");
        env::log_str("Token found");
        // env::log_str(&token.unwrap().extra);
        env::log_str(might_extra(&token).as_str());
        return token.extra;
    }
}