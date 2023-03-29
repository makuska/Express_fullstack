import "./App.css";
import { useRef, useState, useEffect } from "react";
//import Users from "./Components/Users";
function App() {
  const inputName = useRef("");
  const inputEmail = useRef("");
  const apiUrl = "http://localhost:8080";
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch(`${apiUrl}/users`);
      const data = await res.json(); console.log("This is the data coming from APIene, bre: " + JSON.stringify(data, 2,0));
      setUsers(data);
    }

    fetchUsers();
  }, []);


  function onSubmit(e) {
    e.preventDefault();
    addNewUser();
  }


  function addNewUser() {
    const name = inputName.current.value;
    const email = inputEmail.current.value;
    fetch(`${apiUrl}/user/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, email: email }),
    }).then(async (response) => {
      //const data = await response.json();
      //const newData = [...users, data];
      //setUsers(newData);
      if(response.status == 204){
        const res = await fetch(`${apiUrl}/users`);
        const data = await res.json();
        setUsers(data);
        inputName.current.value = "";
        inputEmail.current.value = "";
      } else {
        console.log("We cannot save the User.");
      } 
      
    });
  }

  
  return (
    <div className="App">
      <header className="App-header">
        <p>Users App</p>
        <UsersList users={users} />
      </header>
      <form  onSubmit={onSubmit}>
        <input ref={inputName} type="text" placeholder="Name of user" />
        &nbsp; 
        <input ref={inputEmail} type="text" placeholder="Email of this user" />
        &nbsp; <button>Save User</button>
        <p> &nbsp; </p>
      </form>      
    </div>
  );
}


// using object destructuring on the props object
function UsersList({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user._id}>{user.name}, email: {user.email}</li>
      ))}
    </ul>
  );
}


// Urmaresc ce este aici: https://www.freecodecamp.org/news/react-tutorial-build-a-project/
// Am o problema cu CORS.

/*

function App() {
  const inputText = useRef("");
  const apiUrl = "http://localhost:8080";
  const [users, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch(`${apiUrl}/users`);
      const data = await res.json(); console.log("This is the data coming from API: " + JSON.stringify(data, 2,0));
      setTasks(data.users);
    }

    fetchTasks();
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    addNewTask();
  }

  function addNewTask() {
    const name = inputText.current.value;
    fetch(`${apiUrl}/user/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    }).then(async (response) => {
      const data = await response.json();

      const newData = [...users, data.user];
      setTasks(newData);
      inputText.current.value = "";
    });
  }
  return (
    <div className="App">
      <header className="App-header">
        <p>Users App</p>
      </header>
      <form onSubmit={onSubmit}>
        <input ref={inputText} type="text" placeholder="Name of user" />
        &nbsp; <button>Save User</button>
      </form>
      <Users users={users} />
    </div>
  );
}


*/


export default App;