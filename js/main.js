
/**
 * Sets a cookie which holds the access token after the user 
 * "logs in." This is NOT secure. We will implement a more
 * secure approach in the latter half of the semester.
 * 
 * @param {string} username: Your username for the course API
 * @param {string} password: Your password for the course API 
 */

const rootURL = 'https://photo-app-secured.herokuapp.com';

let token;


async function getAccessToken(rootURL, username, password) {
    const postData = {
        "username": username,
        "password": password
    };
    const endpoint = `${rootURL}/api/token/`;
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    });
    const data = await response.json();
    return data.access_token;
}

const modalElement = document.querySelector('.modal-bg');

//=====<Modal Window Code>==========================================================================

    window.openModal = (id) =>{
        const modalElement = document.querySelector(`.modal-${id}`);
        console.log("open Modal called")
        console.log(id);
        
        // shows the modal:
        modalElement.classList.remove('hidden');

        // accessibility:
        modalElement.setAttribute('aria-hidden', 'false');

        // puts the focus on the "close" button:
        document.querySelector('.close').focus();
    }

    window.closeModal = (id) =>{
        // hides the modal:
        const modalElement = document.querySelector(`.modal-${id}`);
        modalElement.classList.add('hidden');

        // accessibility:
        modalElement.setAttribute('aria-hidden', 'false');

        // puts the focus on the "open" button:
        document.querySelector('.open').focus();
    }

//===================================================================================

//=====<Redraw Tool>==========================================================================

const targetElementAndReplace = (selector, newHTML) => { 
    const div = document.createElement('div'); 
    div.innerHTML = newHTML;
    const newEl = div.firstElementChild; 
    const oldEl = document.querySelector(selector);
    oldEl.parentElement.replaceChild(newEl, oldEl);
}

//===================================================================================


//======<Story Code>=========================================================================

    //=====<Base Story Code>==========================================================================

    const showStories = async () => {
        const endpoint = `${rootURL}/api/stories`;
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json();
        console.log('Stories:', data);
        const start = document.querySelector("story");
        let storyData = data.map(storyToHTML).join("");
        start.innerHTML = storyData;
    }

    const storyToHTML = story =>{
        return`
            <section class="storypannel" id="">
                <button><img class="storyimg" src=${story.user.image_url}></img></button>
                <p class="sugest">${story.user.username}</p>
            </section>
        `;
    }

//===================================================================================

//=====<Post Code>========================================================================

    const showPosts = async () => {
        console.log('code to show posts');

        const endpoint = `${rootURL}/api/posts`;
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        const data = await response.json();
        console.log('Posts:', data);

        const start = document.querySelector("post");
        let postData = data.map(postToHTML).join("");
        start.innerHTML = postData;
        
        const modal = document.querySelector("modal");
        let modalData = data.map(popModal).join("");
        modal.innerHTML = modalData;

        

    }

    const postToHTML = post => {
        
        let comment = "";
        let moreComments = "";
        //if there is more than 0 it equals the first comment
        if(post.comments.length > 1){
            comment = `
            <comment>
                    <b>${post.comments[post.comments.length-1].user.username}</b>
                    <p>${post.comments[post.comments.length-1].text}</p>
                </comment>
            `;
            moreComments = `
            <comment>
                <button class="open" onclick="openModal(${post.id})">view all ${post.comments.length} comment</button>
            </comment>`;
        }

        return`
        
        <card id="post_${post.id}">
            <postContent>
            <heading class="cardhead">  
                <button><h2>${post.user.username}</h2></button>
                <button><h2><i class="fa-solid fa-ellipsis"></i></h2></button>
            </heading>
            <img class="post" src="${post.user.image_url}"></img>
            <symbols>
                <left>
                    ${getHeartButton(post)}
                    <button class="comment  Click"><i class="fa-regular fa-comment"></i></button>
                    <button class="sendClick"><i class="fa-regular fa-paper-plane"></i></button>
                </left>
                ${getBookmarkButton(post)}
            </symbols>
            <likes>
                <b>${post.likes.length} Likes</b>
            </likes>
            <imgcaption>
                <b>${post.user.username}</b>
                <p>${post.caption}</p>
            </imgcaption>
            <comments>
                ${comment}
                ${moreComments}
            </comments>
            <p id="timestamp">${post.display_time}</p>
            <typecomment>
                <typeleft>
                    <smile>
                        <i class="fa-regular fa-face-smile"></i>
                    </smile>
                    <div class="type">
                        <input id="text_${post.id}" type="text" placeholder="Add a comment..."/>
                    </div>
                </typeleft>
                <postbutton onclick="AddComment(${post.id})">
                    <button>Post</button>
                </postbutton>
            </typecomment>
            </postContent>
        </card>
        `;
        

    }

    //=====<Request Redraw Code>================================================================

    const requeryPostRedraw = async (postId) => {
        //console.log(postId);
        const endpoint = `${rootURL}/api/posts/${postId}`;
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json(); 
        console.log(data);
        
        const htmlString = postToHTML(data);
        
        targetElementAndReplace(`#post_${postId}`, htmlString);
    }

    //=====<Like Functionality>===============================================================
    const getHeartButton = post =>{
        if(post.current_user_like_id){
            return`
                <style>
                .fa{
                    color: red;
                }
                }
                </style>
                <button aria-label="Like the post" aria-checked="true" class="heartClick" onclick="unlikePost(${post.current_user_like_id}, ${post.id})">
                    <i class="fa fa-heart"></i>
                </button>
                `;
        }else{
            return `
                <button aria-label="Unlike the post" aria-checked="false" class="heartClick" onclick="likePost(${post.id})">
                    <i class="fa-regular fa-heart" ></i>
                </button>
            `;
        }
    }

    const likePost = async (postId) => {
        // define the endpoint:
        
        const endpoint = `${rootURL}/api/posts/likes/`;
        const postData = {
            "post_id": postId
        };

        // Create the bookmark:
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(postData)
        })
        const data = await response.json();
        console.log(data);
        requeryPostRedraw(postId);
    }

    const unlikePost = async(ID, postId)=>{
        // define the endpoint:
        const endpoint = `${rootURL}/api/posts/likes/${ID}`;

        // Create the bookmark:
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json();
        console.log(data);
        requeryPostRedraw(postId);
    }

    //=====<Bookmark Code>==================================================================

    const getBookmarkButton = post =>{
        if(post.current_user_bookmark_id){
            return `
                <button aria-label="Bookmark The Post" aria-checked="true" onclick="unbookmarkPost(${post.current_user_bookmark_id}, ${post.id})">
                    <i class="fa-solid fa-bookmark"></i>
                </button>
            `;
        }else{
            return `
                <button aria-label="Unbookmark the Post" aria-checked="false" onclick="bookmarkPost(${post.id})">
                    <i class="fa-regular fa-bookmark"></i>
                </button>
            `;
        }
    }

    const bookmarkPost = async (postId) => {
        // define the endpoint:
        const endpoint = `${rootURL}/api/bookmarks/`;
        const postData = {
            "post_id": postId
        };
    
        // Create the bookmark:
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(postData)
        })
        const data = await response.json();
        console.log(data);
        requeryPostRedraw(postId);
    }
    
    const unbookmarkPost = async (bookmarkId, postId) => {
        // define the endpoint:
        const endpoint = `${rootURL}/api/bookmarks/${bookmarkId}`;
        console.log(endpoint);
        // Create the bookmark:
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json();
        console.log(data);
        requeryPostRedraw(postId);
    }

    //=====<Comment Modal Code>==========================================================================

    const popModal = post =>{
        const caption="";
        let comments = "";
        if (post.comments.length > 1){
            comments = post.comments.map(modalCommentHTML).join("");
            
        }
        return`
        <style>
        .modal-${post.id} {
            background: rgba(50, 50, 50, 0.8);
            position: fixed;
            top: 0px;
            left: 0px;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        </style>
        <div class="modal-${post.id} hidden" aria-hidden="true" role="dialog">
            
            <section class="modal">
                <button class="close" aria-label="Close the modal window" onclick="closeModal(${post.id})">
                    <i class="fas fa-times"></i>
                </button>

                <section class="modal-body">
                    <img class="modal-image" src=${post.user.image_url}></img>
                    <section class="modal-comments">
                        <section class="commentHeader">
                            <img class="profimg" src=${post.user.image_url}></img>
                            <div id="modalUsername">${post.user.username}</div>
                        </section>
                        <section class="comment-body">
                            ${comments}
                        </section>
                    </section>
                </section> 

            </section>
        </div>
        
        `;
    }

    const modalCommentHTML = (comment) =>{
        let heart = `<button class="heartClick"  aria-checked="" ><i class="fa-regular fa-heart" ></i></button>`;

        return `
            <sub-comment>
                <sub-sub-comment><b>${comment.user.username}</b>  ${comment.text}</sub-sub-comment>
                <div>${comment.display_time}</div>
            </sub-comment>
        `;
    }

    //=====<add Comment Code>==========================================================================

    const AddComment = async (postId) =>{
        //take in an id that can be found in the id of the comment box dom for this post box
        var comment = document.getElementById(`text_${postId}`).value;
        console.log(comment);
        const endpoint = `${rootURL}/api/comments`;
        //check the forat of comment
        const commentData = {
            "post_id": postId,
            "text": comment
        };
    
        // Create the bookmark:
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(commentData)
        })
        const data = await response.json();
        console.log(data);
        requeryPostRedraw(postId);
    }


//=======================================================================================


//=====<Show User Code>==========================================================================

    const showUser = async () =>{
        console.log('code to show user');

        //fetches data for the user part of the right pannel
        const endpoint = `${rootURL}/api/profile`;
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

    


        const data = await response.json();
        console.log('User Data:', data);

        const header = document.querySelector("nav");
        let html = `<button id="username"><b>${data.username}</b></button>`;
        header.insertAdjacentHTML("afterbegin", html);

        const start = document.querySelector("user");
        let userData = userToHTML(data);
        start.innerHTML = userData;
    }

    const userToHTML = data =>{
        return`
        <header id="rechead">
            <img class="headimg" src=${data.image_url}></img>
            <h2 class = "userinfo">${data.username}</h2>
        </header>
        <h3 id="subtitle"> Suggestions for you</h3> 
    `
    }

//===================================================================================

//=====<Recomended Code>==========================================================================
    
    //=====<Base Code>==========================================================================

    const showRecomended = async () =>{
        console.log('code to show recomended');

        const endpoint = `${rootURL}/api/suggestions`;
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        const data = await response.json();
        console.log('Recomended Data:', data);

        const start = document.querySelector("recomended");
        let recomendData = data.map(recomendToHTML).join("");
        start.innerHTML = recomendData;
    }

    const recomendToHTML = data =>{
        return`
        <section class="rec">
            <front>
                <img class="profimg" src=${data.image_url}></img>
                <subtext>
                        <div class="a">${data.username}</div>
                        <h4 class="b">sugested for you</h4>
                </subtext>
            </front>
            <section id="rec_${data.id}">
                <button onclick="followUser(${data.id})">
                    follow
                </button>
            </section>
        </section>
        `
    }

    //=====<Request Redraw Code>================================================================

    const requerySugestRedraw = async (data) => {
        //console.log(postId);
        //check to see if
        var domID = data;
        var button = "follow";
        id = data;
        checked = "false";
        label = "Follow the user"
        //console.log(id);
        //depending if it is true or false button is changed from unfollow to follow
        if(data.following){
            button = "unfollow";
            domID = data.following.id;
            id = `${data.id}, ${domID}`;
            checked = "true";
            label = "Unfollow the user";
        }
        const htmlString = `
            <button aria-label="${label}" aria-checked="${checked}" onclick="${button}User(${id})">
                ${button}
            </button>
        `;
        const path = document.querySelector(`#rec_${domID}`);
        path.innerHTML = htmlString;
    }

    //=====<Following/unfollowing Code>==========================================================================

    const followUser = async (followId) => {
        // define the endpoint:
        const endpoint = `${rootURL}/api/following`;
        const followData = {
            "user_id" : followId
        };
    
        // Create the bookmark:
        
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(followData)
        })
        
        const data = await response.json();
        //console.log(data);
        console.log("following " + followId);
        requerySugestRedraw(data);
    }
    
    const unfollowUser = async (followID, domID) => {
        // define the endpoint:
        const endpoint = `${rootURL}/api/following/${followID}`;
        console.log(followID);
        // Create the bookmark:
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const returnData = await response.json();
        console.log("unfollowing " + domID + " " + followID);
        requerySugestRedraw(domID);
    }

//===================================================================================

const initPage = async () => {
    // first log in (we will build on this after Spring Break):
    token = await getAccessToken(rootURL, 'webdev', 'password');

    // then use the access token provided to access data on the user's behalf
    showStories(token);
    showPosts(token);
    showUser(token);
    showRecomended(token);
}

initPage();

