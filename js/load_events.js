var j = 0;

const htmlTemplate = `<div class="row">
              <div class="event-name col-md-3"> Ludo aften</div>
              <div class="event-date col-md-3"> 1/10 VIA kantine kl 19:00</div>
              <div class="event-description col-md-3"> Vi mødes og spiller ludo,
                og finder ludo
                mesteren</div>
              <div class="col-md-3">
                <form class="event-link" action="https://google.com"
                  target="_blank">
                  <input type="submit" value="Link til event" />
                </form>
              </div>
            </div>`;

$.get("../boardgames.json", function (eventsData, status) {
  let events = eventsData.events.events; // wrapped list
  console.log(events);

  events = events.sort(eventCompareByName);

  const eventContainer = $("#tabel1");

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const rowName = event.name;
    const rowDate = event.stringDate;
    const rowDescription = event.description;
    const rowLink = event.link.includes("http")
      ? event.link
      : "https://" + event.link;

    // Uses jquery's .text() method to sanitize input.

    eventContainer.append(htmlTemplate);

    eventContainer.find(".event-name").last().text(rowName);

    eventContainer.find(".event-date").last().text(rowDate);

    eventContainer.find(".event-description").last().text(rowDescription);

    eventContainer.find(".event-link").last().attr("action", rowLink);
  }
});

function eventCompareByName(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}
