
setupUI()

// ============== Global Variables
const baseUrl = "https://tarmeezacademy.com/api/v1"
let currentPage = 1
let lastPage = 1

// ============== // Global Variables

// ============== Infinite Scroll
window.addEventListener("scroll", function(){
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

    if(endOfPage && currentPage < lastPage)
    {
        currentPage = currentPage + 1
        getPosts(false, currentPage)

    }
});
// ============== // Infinite Scroll

getPosts()

function userClicked(userId) {
    window.location = `profile.html?userId=${userId}`
}

function getPosts(reload = true, page = 1){
    toggleLoader(true)
    axios.get(`${baseUrl}/posts?limit=10&page=${page}`)
    .then((response) => {
        toggleLoader(false)
        let posts = response.data.data
        lastPage = response.data.meta.last_page

        if(reload) {
            document.getElementById("posts").innerHTML = ""
        }
            for(pt of posts) {

                let user = getCurrentUser()
                let isMyPost = user != null && pt.author.id == user.id
                let editButtonContent = ``
                let deleteButtonContent = ``

                if(isMyPost){
                    editButtonContent = `<button class='btn btn-secondary' style='float: right' onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(pt))}')">edit</button>`
                    deleteButtonContent = `<button class='btn btn-danger' style='margin-right: 5px; float: right' onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(pt))}')">delete</button>`
                }


                let content = `
                    <div class="card mb-5">
                        <div class="card-header">
                        <span onclick="userClicked(${pt.author.id})" style="cursor: pointer;">
                            <img class="rounded-circle" src="${pt.author.profile_image}" alt="" style="width: 40px;">
                            <b>@${pt.author.username}</b>
                        </span>

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
            document.getElementById("posts").innerHTML += content

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

    // for(tag of posts) {
    //     let tagsContent = `
    //     <b class="bg-secondary p-1 rounded-5 text-light">${tag.tags}</b>
    //     `
    //     document.getElementById("posts").innerHTML += tagsContent
    // }


function loginBtnClicked() {

    const username = document.getElementById("username-input").value
    const password = document.getElementById("password-input").value

    const params = {
        "username": username,
        "password": password
    }

    const url = `${baseUrl}/login`
    toggleLoader(true)
    axios.post(url, params)
    .then((response) => {
        // console.log(response.data.token)
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const modal = document.getElementById("login-Modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("logged in successfully") 
        setupUI()
    }).catch((error) => {
        const errorMessage = error.response.data.message
        showAlert(errorMessage,"danger")
    }).finally(() => {
        toggleLoader(false)
    })
}

function registerBtnClicked() 
{
    const name = document.getElementById("register-name-input").value
    const username = document.getElementById("register-username-input").value
    const password = document.getElementById("register-password-input").value
    const image = document.getElementById("register-image-input").files[0]
    
    let formData = new FormData();
    formData.append("name", name)
    formData.append("username", username)
    formData.append("password", password)
    formData.append("image", image)

    const Headers = {
        "Content-Type": "multipart/form-data",
    }

    const url = `${baseUrl}/register`
    toggleLoader(true)
    axios.post(url, formData, {
        headers: Headers
    })
    .then((response) => {
        // console.log(response.data.token)
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const modal = document.getElementById("register-Modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("New User Registered Successfully") 
        setupUI()
    }).catch((error) => {
        const errorMessage = error.response.data.message
        showAlert(errorMessage,"danger")
    }).finally(() => {
        toggleLoader(false)
    })

    // console.log(name, username, password)
}

function addNewPostBtnClicked() {
    let postId = document.getElementById("post-id-input").value;
    let isCreate = postId == null || postId == ""

    const title = document.getElementById("title-post-input").value
    const body = document.getElementById("body-post-input").value
    const image = document.getElementById("image-input").files[0] 

    let formData = new FormData();
    formData.append("title", title)
    formData.append("body", body)
    formData.append("image", image)
    // const params = {
    //     "username": username,
    //     "password": password
    // }
    let url = ``
    const token = localStorage.getItem("token")
    const Headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }

    if(isCreate)
    {
        url = `${baseUrl}/posts`

    }else {
        formData.append("_method", "put")
        url = `${baseUrl}/posts/${postId}`
    }
    toggleLoader(true)
    axios.post(url, formData, {
        headers: Headers
    })
    .then((response) => {
        const modal = document.getElementById("create-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("New Post Has Been Created")
        getPosts()
    }).catch((error) => {
        const errorMessage = error.response.data.message
        showAlert(errorMessage,"danger")
    }).finally(() => {
        toggleLoader(false)
    })
}

function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("logged out successfully")
    setupUI()
}

function profileClicked() {
    const user = getCurrentUser()
    const userId = user.id
    window.location = `profile.html?userId=${userId}`
}

function toggleLoader(show = true) {
    if(show) {
        document.getElementById("loader").style.visibility = "visible"
    }else {
        document.getElementById("loader").style.visibility = "hidden"
    }
}

function setupUI() {

    const token = localStorage.getItem("token")

    const loginDiv = document.getElementById("login-div")
    const logoutDiv = document.getElementById("logout-div")
    const addBtnDiv = document.getElementById("add-btn")
    // const createCommentsDiv = document.getElementById("comments")

    if(token == null) // user is guest (not logged im)
    {
        if(addBtnDiv != null)
        {
            addBtnDiv.style.setProperty("display", "none", "important")
        }
        loginDiv.style.setProperty("display", "flex", "important")
        logoutDiv.style.setProperty("display", "none", "important")
    }else { // for logged in user
        if(addBtnDiv != null)
        {
            addBtnDiv.style.setProperty("display", "block", "important")
        }
        loginDiv.style.setProperty("display", "none", "important")
        logoutDiv.style.setProperty("display", "flex", "important")

        const user = getCurrentUser()
        document.getElementById("nav-username").innerHTML = user.username
        document.getElementById("nav-user-image").src = user.profile_image
    }
}

function showAlert(customMassage, type="success") 
{
    const alertPlaceholder = document.getElementById('success-alert')

    const alert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    alert(customMassage, type)


    // todo: hide the alert
    setTimeout(() => {
        // const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
        // // alertToHide.close()
    }, 2000);
}

function getCurrentUser(){
    let user = null
    const storageUser = localStorage.getItem("user")
    if(storageUser != null) {
        user = JSON.parse(storageUser)
    }
    return user
}

function postClicked(postId){
    // alert(postId)
    window.location = `postPage.html?postId=${postId}`
}

const urlParams = new URLSearchParams(window.location.search)
let id = urlParams.get("postId")
console.log(id)

showPost()
function showPost(){
    
    axios.get(`${baseUrl}/posts/${id}`)
    .then((response) => {
        const post = response.data.data
        const comments = post.comments
        const author = post.author
        const time = post.author.created_at
        const date = new Date(time).toLocaleDateString();
        

        document.getElementById("username-span").innerHTML = author.username
        document.getElementById("userId").innerHTML = author.id
        document.getElementById("userTime").innerHTML = date
        document.getElementById("username2-span").innerHTML = author.username
        document.getElementById("user-name-span").innerHTML = author.name
        document.getElementById("user-img-span").src = author.profile_image
        
        let postTitle = ""
        if(post.title != null)
        {
            postTitle = post.title
        }
        let commentsContent = ``
        for(comment of comments) {
            commentsContent += `
                <div class="p-3" style="background-color: aliceblue;">
                <!-- profile pic + username -->
                <div>
                    <img class="rounded-circle" style="width: 40px;" src="${comment.author.profile_image}">
                    <b>@${comment.author.username}</b>
                </div>
                <!--// profile pic + username //-->
                <!-- comment body -->
                <div>
                ${comment.body}
                </div>
                <!--// comment body //-->
                </div>
            `
        }

        let postContent = 
        `
        <div id="post-one" >
                    <div class="card mb-5">
                        <div class="card-header">
                            <img class="rounded-circle" src="${author.profile_image}" alt="" style="width: 40px;">
                            <b>${author.username}</b>
                        </div>
                        <div class="card-body">
                            <img class="w-100" src="${post.image}" alt="">
                            <p class="text-secondary" id="add-time">${post.created_at}</p>
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">${post.body}</p>
                            <hr>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                            </svg>
                            <span>commint (${post.comments_count})</span>

                        </div>
                        <div id="comments">
                            ${commentsContent}
                            <div style=" padding: 10px; background-color: rgb(240,248,255);">
                                <input id="comment-input" style="width: 90%; margin-top: 20px;" type="text" placeholder="add your comment here...">
                                <input onclick="createCommentClicked()" type="button" value="send">
                            </div>
                        </div>
                    </div>
                </div>
        `
        document.getElementById("post-one").innerHTML = postContent
    })
}

function createCommentClicked(){

    let commentBody = document.getElementById("comment-input").value

    const params = {
        "body": commentBody
    }
    const token = localStorage.getItem("token")
    const url = `${baseUrl}/posts/${id}/comments`
    
    axios.post(url, params, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })
    .then((response) => {
        console.log(response.data)
        showPost()
        showAlert("The comment has been created successfully", "success")
        // showAlert("logged in successfully") 
        // setupUI()
    }).catch((error) => {
        const errorMessage = error.response.data.message
        showAlert(errorMessage,"danger")
    })
}


function editPostBtnClicked(postObject) {
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)

    document.getElementById("post-id-input").value = post.id
    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("post-modal-btn").innerHTML = "Update"
    document.getElementById("title-post-input").value = post.title
    document.getElementById("body-post-input").value = post.body
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal", {}))
    postModal.toggle()
    
}   

function createNewPostBtnClicked() {
    document.getElementById("post-id-input").value = ""
    document.getElementById("post-modal-title").innerHTML = "Create A New Post"
    document.getElementById("post-modal-btn").innerHTML = "Create"
    document.getElementById("title-post-input").value = ""
    document.getElementById("body-post-input").value = ""
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal", {}))
    postModal.toggle()
}

function deletePostBtnClicked(postObject) {
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)

    document.getElementById("delete-post-id-input").value = post.id

    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("post-modal-btn").innerHTML = "Update"
    document.getElementById("title-post-input").value = post.title
    document.getElementById("body-post-input").value = post.body
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal", {}))
    postModal.toggle()
    
}  

function confirmPostDelete() {
    const postId = document.getElementById("delete-post-id-input").value

    const token = localStorage.getItem("token")
    const Headers = {
        "authorization": `Bearer ${token}`
    }

    const url = `${baseUrl}/posts/${postId}`
    axios.delete(url, {
        headers: Headers
    })
    .then((response) => {
        const modal = document.getElementById("delete-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("The Post Has Been Deleted Successfully", "success")
        getPosts()
    }).catch((error) => {
        const errorMessage = error.response.data.message
        showAlert(errorMessage,"danger")
    })
}