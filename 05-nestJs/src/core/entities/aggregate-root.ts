/* eslint-disable prettier/prettier */
import { DomainEvent } from '../events/domain-event'
import { DomainEvents } from '../events/domain-events'
import { Entity } from './entity'

export abstract class AggregateRoot<Props> extends Entity<Props> {
    private _domainEvents: DomainEvent[] = []

    get domainEvents(): DomainEvent[] {
        return this._domainEvents
    }

    protected addDomainEvent(event: DomainEvent): void {
        this._domainEvents.push(event)
        DomainEvents.markAggregateForDispatch(this)
    }

    public clearEvents(){
        this._domainEvents = []
    }
}
