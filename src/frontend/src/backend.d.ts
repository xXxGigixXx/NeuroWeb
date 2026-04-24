import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ConnectionId = bigint;
export type ThoughtId = bigint;
export interface CreateThoughtArgs {
    tag?: string;
    title: string;
    description?: string;
}
export interface Connection {
    id: ConnectionId;
    toId: ThoughtId;
    fromId: ThoughtId;
}
export interface Thought {
    id: ThoughtId;
    tag?: string;
    title: string;
    createdAt: bigint;
    description?: string;
}
export interface backendInterface {
    clearAll(): Promise<void>;
    createConnection(fromId: ThoughtId, toId: ThoughtId): Promise<Connection>;
    createThought(args: CreateThoughtArgs): Promise<Thought>;
    deleteConnection(id: ConnectionId): Promise<void>;
    deleteThought(id: ThoughtId): Promise<void>;
    getThought(id: ThoughtId): Promise<Thought | null>;
    listConnections(): Promise<Array<Connection>>;
    listThoughts(): Promise<Array<Thought>>;
}
