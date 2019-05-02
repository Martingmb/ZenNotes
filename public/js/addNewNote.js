function createFetchNote(blogTitle, blogAuthor, blogContent) {
    let url = '/blog/api/post-blog';
    let settings = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: blogTitle,
            content: blogContent,
            author: blogAuthor
        })
    };

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error("Something went wrong.");
            }
        })
        .then(responseJSON => {
            console.log(responseJSON);
            alert("Your blog was added correctly. Hit the CLICK ME BUTTON to load it")
        })
        .catch(err => {
            console.log(err);
        });
}


function watchForm() {
    $('#addForm').on('submit', function(e) {
        e.preventDefault();
        createFetchNote();
    });

}

$(watchForm);