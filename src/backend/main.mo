import List "mo:core/List";
import Types "types/thoughts-and-connections";
import ThoughtsAndConnectionsApi "mixins/thoughts-and-connections-api";

actor {
  let thoughts = List.empty<Types.Thought>();
  let connections = List.empty<Types.Connection>();
  var nextThoughtId : Nat = 0;
  var nextConnectionId : Nat = 0;

  include ThoughtsAndConnectionsApi(thoughts, connections, nextThoughtId, nextConnectionId);
};
