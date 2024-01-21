$(document).ready(function () {
    // when the DOM is fully loaded then calling fetchRepositories() 
    fetchRepositories(1);

});

let currentPage = 1;
let lastFetchedPage = 1;

function getRepos(records) {
    console.log(records)
}

// for fetching 50 and 100 records
$('#selectrepo').on('change', function () {
    var perPage = $(this).val(); // Get the selected value from the dropdown
    fetchRepositories(1, perPage); // Assuming you want to fetch the first page each time the perPage changes
})

// setting the page active by passing page number
function setActivePage(page) {
    $('.pagination li').removeClass('active');
    $(`.pagination li:contains('${page}')`).addClass('active');
}


// For previous page
function fetchPreviousPage() {
    if (currentPage > 1) {
        fetchRepositories(currentPage - 1);
    }else{
        alert('You are on 1st page');
    }
}

// For next page
function fetchNextPage() {
    fetchRepositories(currentPage + 1);
}

// fetching repos
async function fetchRepositories(page = currentPage, perPage = 10) {
    // console.log(records)
    // return false;
    // var perPage = 10;
    const username = 'johnpapa';
    const repositoriesRow = $("#repositoriesRow");


    repositoriesRow.innerHTML = "";

    try {
        //    Showing Loader request is done
        showLoader()
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`);


        const data = await response.json();

        if (data[0].owner.login) {

            $("#username").html(data[0].owner.login);
        }
        if (data[0].owner.html_url) {
            $("#gitLink").attr("href", data[0].owner.html_url);
            $("#gitLink").html(data[0].owner.html_url);
        }
        $("#repositoriesRow").html('');

        if (data[0].owner.avatar_url) {
            $(".rounded-circle").attr("src", data[0].owner.avatar_url);
            console.log(data[0].owner.avatar_url)
        }
        // console.log(response.ok)
        if (response.ok == true) {
            // Hiding the loader if the response is found
            hideLoader();
            data.forEach((repo) => {
                // Appended html
                const repoCard = $("<div id='repocard'>").addClass("col-sm-6 mb-3");
                const cardContent = $("<div id='repocardcontent'>").addClass("card");
                const cardBody = $("<div>").addClass("card-body");
                const repoName = $("<h3>").text(repo.name);
                const repoDescription = $("<p>").text(repo.description || "No description available.");

                const repoLanguages = $("<button>")
                    .addClass("btn btn-sm btn-primary")
                    .text(`${repo.language || "Not specified"}`);

                cardBody.append(repoName, repoDescription, repoLanguages);

                cardContent.append(cardBody);

                repoCard.append(cardContent);

                repositoriesRow.append(repoCard);
            });
            // Lastfetched page
            lastFetchedPage = page;
            //changing the value of currentPage
            currentPage = page;
            // To active the page link
            setActivePage(page);

        } else {
            hideLoader();
            throw new Error(data.message || "Failed to fetch repositories.");
        }
    } catch (error) {
        hideLoader();
        console.error("Error:", error.message);
    }
}

// Function for showing loader
function showLoader() {
    $('#loader-wrapper').fadeIn('fast');
    $('body').css('overflow', 'hidden');
}


// Function for hiding loader
function hideLoader() {
    $('#loader-wrapper').fadeOut('fast');
    $('body').css('overflow', 'auto');
}