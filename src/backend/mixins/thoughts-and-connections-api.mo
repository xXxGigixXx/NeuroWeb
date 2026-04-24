import Debug "mo:core/Debug";
import List "mo:core/List";
import Types "../types/thoughts-and-connections";

mixin (
  thoughts : List.List<Types.Thought>,
  connections : List.List<Types.Connection>,
  nextThoughtId : Nat,
  nextConnectionId : Nat,
) {
  public func createThought(args : Types.CreateThoughtArgs) : async Types.Thought {
    Debug.todo()
  };

  public query func listThoughts() : async [Types.Thought] {
    Debug.todo()
  };

  public query func getThought(id : Types.ThoughtId) : async ?Types.Thought {
    Debug.todo()
  };

  public func deleteThought(id : Types.ThoughtId) : async () {
    Debug.todo()
  };

  public func createConnection(fromId : Types.ThoughtId, toId : Types.ThoughtId) : async Types.Connection {
    Debug.todo()
  };

  public query func listConnections() : async [Types.Connection] {
    Debug.todo()
  };

  public func deleteConnection(id : Types.ConnectionId) : async () {
    Debug.todo()
  };

  public func clearAll() : async () {
    Debug.todo()
  };
};
