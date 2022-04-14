import TokenMetadata from './TokenMetadata';

export default interface Token {
  token_id?: string;
  token_owner_id?: string;
  token_metadata?: TokenMetadata;
}
