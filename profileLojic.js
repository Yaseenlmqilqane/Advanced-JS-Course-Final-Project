setupUI()
getUser()
getPosts()

function getCurrentUserId() {
    const urlParams = new URLSearchParams(window.location.search)
    let id = urlParams.get("userId")
    return id
}
function getUser(){
    const id = getCurrentUserId()
    axios.get(`${baseUrl}/users/${id}`)
    .then((response) => {
        const userPost = response.data.data
        document.getElementById("user-email").innerHTML = userPost.email
        document.getElementById("user-name").innerHTML = userPost.name
        document.getElementById("user-username").innerHTML = userPost.username
        document.getElementById("posts-cunt").innerHTML = userPost.posts_count
        document.getElementById("comments-cunt").innerHTML = userPost.comments_count
        document.getElementById("user-img").src = userPost.profile_image
    })
}
    
function getPosts(){
    const id = getCurrentUserId()
    axios.get(`${baseUrl}/users/${id}/posts`)
    .then((response) => {

        const posts = response.data.data
        document.getElementById("user-post").innerHTML = ""

        for(pt of posts) {

            const author = pt.author
            let user = getCurrentUser()
            let isMyPost = user != null && pt.author.id == user.id
            let editButtonContent = ``
            let deleteButtonContent = ``
            let postTitle = ""

            if (pt.title != null) {
                postTitle = pt.title  
            }

            if(isMyPost){
                    editButtonContent = `<button class='btn btn-secondary' style='float: right' onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(pt))}')">edit</button>`
                    deleteButtonContent = `<button class='btn btn-danger' style='margin-right: 5px; float: right' onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(pt))}')">delete</button>`
            }


            let content = `
                    <div class="card mb-5">
                        <div class="card-header">
                            <img class="rounded-circle" src="${author.profile_image}" alt="" style="width: 40px;">
                            <b>@${author.username}</b>
                            ${editButtonContent}
                            ${deleteButtonContent}
                        </div>
                        <div class="card-body" onclick="postClicked(${pt.id})" style="cursor: pointer;">
                            <img class="w-100" src="${pt.image}" alt="">
                            <p class="text-secondary" id="add-time">${pt.created_at}</p>
                            <h5 class="card-title">${pt.title}</h5>
                            <p class="card-text">${pt.body}</p>
                            <hr>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                            </svg>
                            <span>comments (${pt.comments_count})
                                <span id="post-tags-${posts.id}">
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            `
            document.getElementById("user-post").innerHTML += content

            // const currentPostTagsId = `post-tags-${posts.id}`
            // document.getElementById(currentPostTagsId).innerHTML = ""
            
            // for(tag of post.tags)
            // {
            //     let tagsContent = 
            //     `
            //     <button class="btn btn-sm bg-secondary rounded-5 class="bg-secondary rounded-5" style="color: white">
            //         ${tag.name}
            //     </button>
            //     `
            //     document.getElementById(currentPostTagsId).innerHTML += tagsContent
            // }
        }
    })
}