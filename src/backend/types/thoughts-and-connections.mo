module {
  public type ThoughtId = Nat;
  public type ConnectionId = Nat;

  public type Thought = {
    id : ThoughtId;
    title : Text;
    description : ?Text;
    tag : ?Text;
    createdAt : Int;
  };

  public type Connection = {
    id : ConnectionId;
    fromId : ThoughtId;
    toId : ThoughtId;
  };

  public type CreateThoughtArgs = {
    title : Text;
    description : ?Text;
    tag : ?Text;
  };
};
