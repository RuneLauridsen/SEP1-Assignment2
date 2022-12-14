var j = 0;


const htmlTemplate =
    `<div class="card">
    <img class="card-img-top" src="../images/boardgames/newLudo.jpg" alt="New Ludo">
    <div class="card-body">
        <h5 class="card-title">New Ludo</h5>
        <img class="card-img-players" src="../images/people.png" alt="People icon">
        <p class="card-text card-text-players">2 - 6</p>
        <p class="card-text card-text-owner">Ejer: Mathias Berg</p>
        <p class="card-text card-text-status">Udlånt til: Bob Hansen 24.8.2022</p>
    </div>
</div>`


// https://www.w3schools.com/tags/att_global_data.asp
const currentCategory = document.currentScript.getAttribute("data-category");

$.get("../boardgames.json", function (boardgameClub, status) {
    let boardgames = boardgameClub.boardgames.boardgames; // wrapped list

    boardgames = boardgames.sort(boardgameCompareByRating);

    const boardgameContainer = $("#boardgame-container");

    for (let i = 0; i < boardgames.length; i++) {
        console.log(boardgames[i].name);


        const boardgame = boardgames[i];
        const cardTitle = boardgame.name;
        const cardImgAlt = boardgame.name;
        const cardTextPlayers = boardgame.numberOfPlayers.min + " - " + boardgame.numberOfPlayers.max
        const cardTextOwner = boardgame.owner.name;
        let cardTextStatus = "Ledig";

        const currentLoan = getCurrentLoan(boardgame);
        if (currentLoan != null) {
            cardTextStatus = "Udlånt til: " + currentLoan.student.name + " "
                + currentLoan.interval.to.day + "."
                + currentLoan.interval.to.month + "."
                + currentLoan.interval.to.year;
        }

        // Uses jquery's .text() method to sanitize input.

        boardgameContainer
            .append(htmlTemplate);


        boardgameContainer
            .find(".card-img-top")
            .last()
            .attr("alt", cardImgAlt)

        boardgameContainer
            .find(".card-title")
            .last()
            .text(cardTitle);

        boardgameContainer
            .find(".card-text-players")
            .last()
            .text(cardTextPlayers);

        boardgameContainer
            .find(".card-text-owner")
            .last()
            .text(cardTextOwner);

        boardgameContainer
            .find(".card-text-status")
            .last()
            .text(cardTextStatus);
    }
});

function getCurrentLoan(boardgame) {
    currentDate = Date.now();

    const loans = boardgame.loans.loans;

    for (let i = 0; i < loans.length; i++) {
        const loan = loans[i];

        const from = loan.interval.from;
        const to = loan.interval.to;

        const fromDate = new Date(from.year, from.month - 1, from.day, 0, 0, 0);
        const toDate = new Date(to.year, to.month - 1, to.day, 23, 59, 59);

        if (currentDate >= fromDate && currentDate <= toDate) {
            return loan;
        }
    }

    return null;
}




function boardgameCompareByName(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}

function boardgameCompareByRating(a, b) {
    const aRating = getAverageRating(a);
    const bRating = getAverageRating(b);

    console.log("a: " + aRating);
    console.log("b: " + bRating);

    if (aRating < bRating) {
        return 1;
    }
    if (aRating > bRating) {
        return -1;
    }
    return 0;
}

function getAverageRating(boardgame) {
    const reviews = boardgame.reviews.reviews;

    if (reviews.length == 0) {
        return 0;
    }

    let avg = 0;

    for (let i = 0; i < reviews.length; i++) {
        avg += reviews[i].rating;
    }

    return avg / reviews.length;

}
