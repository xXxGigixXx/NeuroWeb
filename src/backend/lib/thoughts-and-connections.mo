import Debug "mo:core/Debug";
import List "mo:core/List";
import Types "../types/thoughts-and-connections";

module {
  public type ThoughtStore = List.List<Types.Thought>;
  public type ConnectionStore = List.List<Types.Connection>;

  public func createThought(
    thoughts : ThoughtStore,
    nextId : Nat,
    args : Types.CreateThoughtArgs,
    now : Int,
  ) : Types.Thought {
    Debug.todo()
  };

  public func listThoughts(thoughts : ThoughtStore) : [Types.Thought] {
    Debug.todo()
  };

  public func getThought(thoughts : ThoughtStore, id : Types.ThoughtId) : ?Types.Thought {
    Debug.todo()
  };

  public func deleteThought(
    thoughts : ThoughtStore,
    connections : ConnectionStore,
    id : Types.ThoughtId,
  ) : (ThoughtStore, ConnectionStore) {
    Debug.todo()
  };

  public func createConnection(
    thoughts : ThoughtStore,
    connections : ConnectionStore,
    nextId : Nat,
    fromId : Types.ThoughtId,
    toId : Types.ThoughtId,
  ) : Types.Connection {
    Debug.todo()
  };

  public func listConnections(connections : ConnectionStore) : [Types.Connection] {
    Debug.todo()
  };

  public func deleteConnection(connections : ConnectionStore, id : Types.ConnectionId) : ConnectionStore {
    Debug.todo()
  };

  public func clearAll(thoughts : ThoughtStore, connections : ConnectionStore) : (ThoughtStore, ConnectionStore) {
    Debug.todo()
  };
};
