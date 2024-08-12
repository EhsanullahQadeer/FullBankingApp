function Deposit() {
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState('');  

  return (<>
    <Card
      txtcolor="info"
      header="Deposit Coinz"
      status={status}
      body={show ? 
        <DepositForm setShow={setShow} setStatus={setStatus}/> :
        <DepositMsg setShow={setShow} setStatus={setStatus}/>}
    />
  </>
  )
}

function DepositMsg(props) {
  return (<>
    <h5>Success</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={() => {
          props.setShow(true);
          props.setStatus('');
      }}>
        Add more Coinz!
    </button>
  </>);
} 

function DepositForm(props) {
  const ctx = React.useContext(UserContext);  
  const email = ctx.user.email;
  const [amount, setAmount] = React.useState('');
  const [balance, setBalance] = React.useState(0); 
  console.log("deposit");
  
  function getBalance(){
    if(!email){
      alert("login is required!")
    }
    fetch(`/account/find/${email}`)
    .then(response => {
        if (!response.ok) {
            // Handle HTTP errors
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        try {
            setBalance(data.balance);
            console.log('JSON:', data);
        } catch (err) {
            // Handle JSON parsing errors
            props.setStatus('Failed to parse response');
            console.log('ding dong:', text);
        }
    })
    .catch(err => {
        // Handle network errors or other unexpected errors
        props.setStatus('Request failed');
        console.log('err:', err);
    });
  }
  React.useEffect(()=>{
    getBalance()
  },[])
 

  function handle() {
    console.log("click deposit")
    fetch(`/account/update/${email}/${amount}`)
    .then(response => {
        if (!response.ok) {
            // Handle HTTP errors
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('data:', data);
        if (data.error) {
            // Handle application-specific errors
            props.setStatus('Deposit failed: ' + data.error);
            console.log('error:', data.error);
        } else {
            props.setShow(false);
            props.setStatus("Deposit successful");
        }
    })
    .catch(err => {
        // Handle network errors or other unexpected errors
        props.setStatus('Deposit failed');
        console.log('err:', err);
    });
  }

  return(<>
    <h5>Current balance: {parseFloat(balance).toFixed(2)} Coinz</h5>
      
    How many Coinz do you want to add?<br/>
    <input type="number" 
      className="form-control" 
      placeholder="Enter amount" 
      value={amount} onChange={e => setAmount(e.currentTarget.value)}/><br/>

    <button type="submit" 
      className="btn btn-light" 
      onClick={handle}>Deposit</button>
  </>);
}