function Home() {
  return (
    <>
      <Card
        txtcolor="info"
        header="My First Bank"
        title="The first kid-friendly bank!"
        text="Teach your kids the basics of depositing, withdrawing, and checking their Coinz balance!"
        body={(
          <>
            <p className="text-center"><img src="./piggy.png" className="img-fluid" alt="Bank logo"/></p>
          </>
          )}
      /> 
    </> 
  );  
}
