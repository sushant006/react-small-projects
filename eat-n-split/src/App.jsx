import { useState } from "react";
const initialFriends = [
  
];
function Button({children, onClick})
{
  return <button className="button" onClick={onClick}>{children}</button>
}

export default function App() {
  const[showAddFriend,setShowAddFriend] = useState(false);
  const[friends,setFriends] = useState(initialFriends);
  const[selectedFriend,setSelectedFriend] = useState(null);
  function handleShowAddFriend()
  {
    setShowAddFriend((show) => !show)
  }
  function handleAddFriend(friend){
    setFriends((friends)=>[...friends,friend]);
    setShowAddFriend(false);
  }
  function handleSelection(friend){
    //setSelectedFriend(friend);
    setSelectedFriend((cur)=>(cur?.id === friend.id ? null : friend))
    setShowAddFriend(false);
  }
  function handleSplitBill(value)
  {
    setFriends(friends=>friends.map(friend => friend.id === selectedFriend.id ?
       {...friend,balance : friend.balance+value}:friend))
       setSelectedFriend(null)
  }
  return(
  <>
  <h1 style={{textAlign:'center', marginBottom:'3rem'}}>Eat&Split</h1>
  <div className="app">
    <div className="sidebar">
      <FriendList friends = {friends} onSelection = {handleSelection} selectedFriend = {selectedFriend}/>
      {showAddFriend && <FormAddFriend onAddFriend = {handleAddFriend}/>}
      <Button onClick={handleShowAddFriend}>{showAddFriend ? "Close" : "Add Friend"}</Button>
    </div>
    {selectedFriend && <FormSplitBill selectedFriend = {selectedFriend} onSplitBill = {handleSplitBill}/>}
  </div>
  </>
  );
}
  
function FriendList({friends,onSelection,selectedFriend})
{
  //const friends = initialFriends;
  return(
  <ul>
   {
    friends.map((friend)=>(
      <Friend friend={friend} key={friend.id} onSelection = {onSelection} selectedFriend = {selectedFriend}></Friend>
    ))
   }
  </ul>
  );
}
function Friend({friend,onSelection,selectedFriend})
{
  const isSelected = selectedFriend?.id === friend.id;
  return(
    <li className={isSelected?"selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance<0  && (
        <p className="red">You owe {friend.name} {Math.abs(friend.balance)}$</p>
      )}
      {friend.balance>0  && (
        <p className="green">{friend.name} owes you {Math.abs(friend.balance)}$</p>
      )}
      {friend.balance === 0  && (
        <p>You and {friend.name} are even</p>
      )}
      <Button onClick={()=>onSelection(friend)}>{isSelected?"Close" : "Select"}</Button>
    </li>  
  );
}

function FormAddFriend({onAddFriend}) {
  const[name,setName] = useState("");
  const[image,setImage] = useState("https://i.pravatar.cc/48")
  function handleSubmit(e)
  {
    e.preventDefault();
    if(!name || !image)
      {
        return;
      }
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image : `${image}?=${id}`,
      balance:0
    }
    onAddFriend(newFriend);
    setName('');
    setImage('https://i.pravatar.cc/48')
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🤝 Friend Name</label>
      <input type="text"
       value = {name}
       onChange={(e)=>setName(e.target.value)}
       />
      <label>🖼️ Image URL</label>
      <input type="text" 
       value = {image}
       onChange={(e)=>setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({selectedFriend, onSplitBill})
{
  const[bill,setBill] = useState("");
  const[paidByUser,setPaidByUser] = useState("");
  const paidByFriend = bill? bill-paidByUser : "";
  const[whoIsPaying,setWhoIsPaying] = useState("user")
  function handleSubmit(e)
  {
    e.preventDefault();

    if(!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === 'user'? paidByFriend : -paidByUser)
  }
  return(
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a Bill with {selectedFriend.name}</h2>
      <label>🤑 Bill Value</label>
      <input type="text" 
       value={bill}
       onChange={(e)=> setBill(Number(e.target.value))}
      />
      <label>👲 Your Expense</label>
      <input type="text"
       value={paidByUser}
       onChange={(e)=> setPaidByUser(Number(e.target.value)>bill ? paidByUser : Number(e.target.value))}
       />
      <label>🧑‍🤝‍🧑 {selectedFriend.name}'s Expense</label>
      <input type="text" 
       value={paidByFriend}
      disabled />
      <label>💴Who is paying the bill?</label>
      <select
       value={whoIsPaying}
       onChange={(e)=> setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value = "friend">{selectedFriend.name}</option>
      </select>
      <Button>Add</Button>
    </form>
  );
}