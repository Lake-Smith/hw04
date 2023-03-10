
import {getAccessToken} from './utilities.js';
const rootURL = 'https://photo-app-secured.herokuapp.com';

const modalElement = document.querySelector('.modal-bg');

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

const showStories = async (token) => {
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

const showPosts = async (token) => {
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

const popModal = post =>{
    const caption="";
    
    const comments = "";
    if(post.comments[0] != null){
        comments = `
        <div class="row">
        <img src="${post.comments[0].user.image_url}"></img>
        <div class="modal-comment-text">
            <p>Some comment text</p>
        </div>
        <button class="like-comment">some button</button>
        </div>
    `
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
            <button class="close" aria-label="Close the modal window" onclick="closeModal(${post.id})">Close</button>
            <div class="modal-body">
                <div class="image" style="background-image: url('https://picsum.photos/600/430?id=139${post.image_url}');"></div>
                <section class="modal-comments">
                        
                </section>
            </div>  
        </section>
    </div>
    
    `;
}

const postToHTML = post => {
    
    let comment = "";
    let moreComments = "";
    //if there is more than 0 it equals the first comment
    if(post.comments.length > 1){
        comment = `
        <comment>
                <b>${post.comments[0].user.username}</b>
                <p>${post.comments[0].text}</p>
            </comment>
        `;
        moreComments = `
        <comment>
            <button class="open" onclick="openModal(${post.id})">view all ${post.comments.length} comment</button>
        </comment>`;
    }

    let heart = `<button class="heartClick"><i class="fa-regular fa-heart" ></i></button>`;

    //check to see if the post is liked or not
    if(post.current_user_like_id != null){
        heart = `
        <style>
        .fa{
            color: red;
        }
        }
        </style>
        <button class="heartClick"><i class="fa fa-heart"></i></button> 
        `;

    }

    //check to see if the post is bookmarked
    let mark = `<button class="bookmarkClick"><i class="fa-regular fa-bookmark"></i></button>`;

    if(post.current_user_bookmark_id != null){
        mark = `
        <style>
            .fa-bookmark{
                color: #2e3134;
            }
        </style>
        <button class="bookmarkClick"><i class="fa fa-bookmark"></i></button>
        `;
    }

    return`
    
    <card>
        <postContent>
        <heading class="cardhead">  
            <button><h2>${post.user.username}</h2></button>
            <button><h2><i class="fa-solid fa-ellipsis"></i></h2></button>
        </heading>
        <img class="post" src="${post.user.image_url}"></img>
        <symbols>
            <left>
                ${heart}
                <button class="comment  Click"><i class="fa-regular fa-comment"></i></button>
                <button class="sendClick"><i class="fa-regular fa-paper-plane"></i></button>
            </left>
            ${mark}
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
                <type>
                    <input type="text" placeholder="Add a comment..."/>
                </type>
            </typeleft>
            <postbutton>
                <button>Post</button>
            </postbutton>
        </typecomment>
        </postContent>
    </card>
    `;
    

}



const showUser = async (token) =>{
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



const showRecomended = async (token) =>{
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
        <button class="follow"><p>follow</p></button>
    </section>
    `
}

const initPage = async () => {
    // first log in (we will build on this after Spring Break):
    const token = await getAccessToken(rootURL, 'webdev', 'password');

    // then use the access token provided to access data on the user's behalf
    showStories(token);
    showPosts(token);
    showUser(token);
    showRecomended(token);
}

initPage();

