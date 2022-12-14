$.get("../boardgames.json", function (contactData, status) {
  let contactInfo = contactData.contactInformation;
  console.log(contactInfo);

  // Uses jquery's .text() method to sanitize input.

  var container = $("#ceo-contact");

  container.find("#contact-name").text(contactInfo.name);
  container.find("#contact-email").text(contactInfo.email);
  container.find("#contact-email").attr("href", "mailto:" + contactInfo.email);
  container.find("#contact-phone").text(contactInfo.phone);
});
