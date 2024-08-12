function Withdraw() {
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState('');  

  return (
    <Card
      txtcolor="info"
      header="Withdraw Coinz"
      status={status}
      body={show ? 
        <WithdrawForm setShow={setShow} setStatus={setStatus}/> :
        <WithdrawMsg setShow={setShow} setStatus={setStatus}/>}
    />
  )
}

function WithdrawMsg(props) {
  return(<>
    <h5>Success!</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={() => {
        props.setShow(true);
        props.setStatus('');
      }}>
        Withdraw more Coinz
    </button>
  </>);
}

function WithdrawForm(props) {
  const ctx = React.useContext(UserContext);  
  const email = ctx.user.email;
  const [amount, setAmount] = React.useState('');
  const [balance, setBalance] = React.useState(0); 

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
    fetch(`/account/update/${email}/-${amount}`)
    .then(response => response.text())
    .then(text => {
        try {
            const data = JSON.parse(text);
            props.setStatus(JSON.stringify(data.value));
            props.setShow(false);
            console.log('JSON:', data);
        } catch(err) {
            props.setStatus('Withdrawal failed')
            console.log('err:', text);
        }
    });
  }

  return(<>
    <h5>Current balance: {parseFloat(balance).toFixed(2)} Coinz</h5>
    
    How many Coinz do you want to take out?<br/>
    <input type="number" 
      className="form-control" 
      placeholder="Enter amount" 
      value={amount} 
      onChange={e => setAmount(e.currentTarget.value)}/><br/>

    <button type="submit" 
      className="btn btn-light" 
      onClick={handle}>
        Withdraw
    </button>

  </>);
}
