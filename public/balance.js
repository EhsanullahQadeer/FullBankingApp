function Balance() {
  return (
    <Card
      txtcolor="info"
      header="Coinz Balance"
      body={<BalanceForm/>}
    />
  )
}

function BalanceForm(props) {
  const ctx = React.useContext(UserContext);  
  const email = ctx.user.email;
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

  return (<>
    <h5>You currently have {parseFloat(balance).toFixed(2)} Coinz</h5>
  </>);
}