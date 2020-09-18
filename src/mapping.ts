import {
	ethereum,
} from '@graphprotocol/graph-ts'

import {
	EventToken as EventTokenEvent,
	Transfer   as TransferEvent,
} from '../generated/POAP/POAP'

import {
	Token,
	Account,
	Event,
	Transfer,
} from '../generated/schema'

function createEventID(event: ethereum.Event): string
{
	return event.block.number.toString().concat('-').concat(event.logIndex.toString());
}

export function handleEventToken(ev: EventTokenEvent): void
{
	let event = new Event(ev.params.eventId.toString());
	let token = new Token(ev.params.tokenId.toString());

	token.event = event.id;

	event.save();
	token.save();
}

export function handleTransfer(ev: TransferEvent): void {
	let token    = new Token(ev.params.tokenId.toString());
	let from     = new Account(ev.params.from.toHex());
	let to       = new Account(ev.params.to.toHex());
	let transfer = new Transfer(createEventID(ev));

	token.owner = to.id;

	transfer.token       = token.id;
	transfer.from        = from.id;
	transfer.to          = to.id;
	transfer.transaction = ev.transaction.hash;
	transfer.timestamp   = ev.block.timestamp;

	token.save();
	from.save();
	to.save();
	transfer.save();
}
