import React from "react";
import Header from "./parts/Header";

function Home() {
    return (
        <>
            <Header />
            <div className="homeContainer">
                <h1>Egyetemista vagy?</h1>
                <h1>Segítségre lenne szükséged valamelyik tárgyból?</h1>
                <h1>Vagy Te szeretnél segíteni másoknak?</h1>
                <h1>Akkor ne habozz, csatlakozz!</h1>
            </div>
        </>
    );
}

export default Home;