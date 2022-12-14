reloadBoardgames("name");

$("#sort").change(function () {
    reloadBoardgames($(this).val());
})

// https://www.w3schools.com/tags/att_global_data.asp
const currentCategory = document.currentScript.getAttribute("data-category");
const htmlTemplate =
    `<div class="card">
        <img class="card-img-top" src="../images/boardgames/newLudo.jpg" alt="New Ludo">
        <div class="card-body">
            <h5 class="card-title">New Ludo</h5>
            <p class="card-text card-text-rating">5</p>
            <img class="card-img-players" src="../images/people.png" alt="People icon">
            <p class="card-text card-text-players">2 - 6</p>
            <p class="card-text card-text-owner">Ejer: Mathias Berg</p>
            <p class="card-text card-text-status">Udlånt til: Bob Hansen 24.8.2022</p>
        </div>
    </div>`

function reloadBoardgames(sort) {

    $.get("../boardgames.json", function (boardgameClub, status) {
        let boardgames = boardgameClub.boardgames.boardgames; // wrapped list

        if (sort == "name")
            boardgames = boardgames.sort(boardgameCompareByName);
        else if (sort == "rating")
            boardgames = boardgames.sort(boardgameCompareByRating);

        const boardgameContainer = $("#boardgame-container");
        boardgameContainer.html("");

        for (let i = 0; i < boardgames.length; i++) {
            const boardgame = boardgames[i];

            const ignoreBought = boardgame.isBought == false;
            const ignoreCategory = boardgame.category != currentCategory && currentCategory != "ALL"
            if (ignoreBought || ignoreCategory)
                continue;

            const cardTitle = boardgame.name;
            const cardImgAlt = boardgame.name;
            const cardTextPlayers = boardgame.numberOfPlayers.min + " - " + boardgame.numberOfPlayers.max
            const cardTextOwner = boardgame.owner.name;
            const cardTextRating = getRatingText(boardgame);
            const cardTextStatus = getStatusText(boardgame);


            // Uses jquery's .text() method to sanitize input.

            boardgameContainer
                .append(htmlTemplate);

            // TODO: Get images from java app
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

            boardgameContainer
                .find(".card-text-rating")
                .last()
                .text(cardTextRating);
        }
    });
}

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

function getRatingText(boardgame) {
    avgRating = getAverageRating(boardgame);

    if (avgRating == null) { // boardgame has no review
        return "Ikke anmeldt"
    }
    else {
        avgRatingRounded = Math.round(avgRating);
        return "★".repeat(avgRatingRounded) + "☆".repeat(5 - avgRatingRounded) + " (" + avgRating.toFixed(1) + ")";
    }
}

function getStatusText(boardgame) {

    const currentLoan = getCurrentLoan(boardgame);
    if (currentLoan == null) {
        return "Ledig";
    }
    else {
        return "Udlånt til: " + currentLoan.student.name + " " +
            currentLoan.interval.to.day + "." +
            currentLoan.interval.to.month + "." +
            currentLoan.interval.to.year;
    }
}


function boardgameCompareByName(a, b) {

    if (a.name.toUpperCase() < b.name.toUpperCase()) {
        return -1;
    }
    if (a.name.toUpperCase() > b.name.toUpperCase()) {
        return 1;
    }
    return 0;
}

function boardgameCompareByRating(a, b) {
    const aRating = getAverageRating(a);
    const bRating = getAverageRating(b);

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
        return null;
    }

    let avg = 0;

    for (let i = 0; i < reviews.length; i++) {
        avg += reviews[i].rating;
    }

    return avg / reviews.length;

}
