(function(exports, d) {
  function domReady(fn, context) {

    function onReady(event) {
      d.removeEventListener("DOMContentLoaded", onReady);
      fn.call(context || exports, event);
    }

    function onReadyIe(event) {
      if (d.readyState === "complete") {
        d.detachEvent("onreadystatechange", onReadyIe);
        fn.call(context || exports, event);
      }
    }

    d.addEventListener && d.addEventListener("DOMContentLoaded", onReady) ||
    d.attachEvent      && d.attachEvent("onreadystatechange", onReadyIe);
  }

  exports.domReady = domReady;
})(window, document);

var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function toParams(data_js) {
  var form_data = [];

  for (var key in data_js) {
    form_data.push(encodeURIComponent(key) + "=" + encodeURIComponent(data_js[key]));
  }

  return form_data.join("&");
}

domReady(function() {
  var menu = document.getElementById("collapse-menu");
  var seeMoreProjects = document.getElementById("seeMoreProjects");
  var seeMoreVideos = document.getElementById("seeMoreVideos");
  var seeAllCompanies = document.getElementById("seeAllCompanies");
  var navMobile = document.getElementsByClassName("nav-mobile")[0];
  var sendMessage = document.getElementById("send-message");
  var formName = document.getElementById("form-name");
  var formEmail = document.getElementById("form-email");
  var formPhone = document.getElementById("form-phone");
  var formMessage = document.getElementById("form-message");
  var formSend = document.getElementById("form-send");
  var formError = document.getElementById("form-error");
  var form = document.getElementsByClassName("contact-form")[0];
  var menuLinks = document.getElementsByClassName("menu__link");

  navMobile.addEventListener("click", function(event) {
    var el = document.getElementsByClassName("nav-mobile")[0];
    el.classList.toggle("show");
  });

  menu.addEventListener("click", function(event) {
    event.preventDefault();
    var el = document.getElementsByClassName("nav-mobile")[0];
    el.classList.toggle("show");
  });

  var projectFilters = document.getElementsByClassName("project-filter");

  for (var i = 0; i < projectFilters.length; ++i) {
    (function (index) {
      projectFilters[index].addEventListener("click", function(event) {
        event.preventDefault();

        for (var i = 0; i < projectFilters.length; ++i) {
          projectFilters[i].classList.remove("active");
        }

        event.target.classList.add("active");

        var dataType = event.target.getAttribute("data-type");
        var projectItems = document.getElementsByClassName("projects__item");

        if(dataType === "all") {
          for (j = 0; j < projectItems.length; ++j) {
            (function(index) {
              projectItems[index].classList.remove("hidden");
            })(j);
          }
        } else {
          for (var j = 0; j < projectItems.length; ++j) {
            (function(index2) {
              projectItems[index2].classList.add("hidden");
            })(j);
          }

          var selectedProjectItems = document.getElementById("projects-list").getElementsByClassName(dataType);
          for (j = 0; j < selectedProjectItems.length; ++j) {
            (function(index2) {
              selectedProjectItems[index2].classList.remove("hidden");
            })(j);
          }
        }

        if(seeMoreProjects) {
          seeMoreProjects.parentNode.removeChild(seeMoreProjects);
          seeMoreProjects = null;
        }
      });
    })(i);
  }

  for (i = 0; i < menuLinks.length; ++i) {
    (function (index) {
      menuLinks[index].addEventListener("click", function(event) {
        for (var i = 0; i < menuLinks.length; ++i) {
          menuLinks[i].classList.remove("active");
        }
        event.target.classList.add("active");
      });
    })(i);
  }

  seeMoreProjects.addEventListener("click", function(event) {
    event.preventDefault();

    var projectItems = document.getElementsByClassName("projects__item");

    for (var i = 0; i < projectItems.length; ++i) {
      (function(index2) {
        projectItems[index2].classList.remove("hidden");
      })(i);
    }

    event.target.parentNode.removeChild(event.target);
    seeMoreProjects = null;
  });

  seeAllCompanies.addEventListener("click", function(event) {
    event.preventDefault();

    var projectItems = document.getElementsByClassName("companies-item");

    for (var i = 0; i < projectItems.length; ++i) {
      (function(index2) {
        projectItems[index2].classList.remove("hidden");
      })(i);
    }

    event.target.parentNode.removeChild(event.target);
  });

  seeMoreVideos.addEventListener("click", function(event) {
    event.preventDefault();

    var projectItems = document.getElementsByClassName("talks__item");

    for (var i = 0; i < projectItems.length; ++i) {
      (function(index2) {
        projectItems[index2].classList.remove("hidden");
      })(i);
    }

    event.target.parentNode.removeChild(event.target);
  });

  sendMessage.addEventListener("click", function(event) {
    event.preventDefault();

    var name = formName.value;
    var email = formEmail.value;
    var phone = formPhone.value;
    var message = formMessage.value;
    var error = false;

    if(!name.length) {
      error = true;
      formName.classList.add("error");
    }
    if(!email.length || !emailRegex.test(email)) {
      error = true;
      formEmail.classList.add("error");
    }
    if(!message.length) {
      error = true;
      formMessage.classList.add("error");
    }

    if(!error) {
      //send form
      //hide send button
      sendMessage.style.display = "none";
      formError.style.display = "none";

      //prepare email content
      var emailContent = "Name: " + name + "\n"
        + "Email: " + email + "\n"
        + "Phone: " + phone+ "\n"
        + "Message: " + message;

      var request = new XMLHttpRequest();

      request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
          //success
          form.style.display = "none";
          formSend.style.display = "";
        } else
        if(request.readyState == 4) {
          //error
          sendMessage.style.display = "";
          formError.style.display = "";
        }
      };

      //combine params
      var data_js = {
        "access_token": "dk6qipt22215arnk1kv63qex",
        "subject": "Contact Me form",
        "text": emailContent
      };

      var params = toParams(data_js);

      request.open("POST", "https://postmail.invotes.com/send", true);
      request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      request.send(params);
    }

  });

  var removeError = function(event) {
    event.target.classList.remove("error");
  };

  formName.addEventListener("focus", removeError);
  formEmail.addEventListener("focus", removeError);
  formMessage.addEventListener("focus", removeError);
});
