# Marketplace page notes

`/marketplace` lists every `ACTIVE` resale listing via
`GET /tickets/resale` and lets a logged-in, wallet-connected user buy
one through the standard build/sign/submit flow
(`POST /tickets/:id/buy-resale` then `confirm-buy-resale`). Price and
royalty enforcement happen entirely on-chain (see the blockchain
repo's `list_for_resale`/`buy_resale`) — this page just displays what
the contract already allowed to be listed.
