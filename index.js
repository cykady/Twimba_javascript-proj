import { tweetsData as data } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
let tweetsData = []

if (localStorage.getItem('tweetsData')){
    tweetsData = JSON.parse(localStorage.getItem('tweetsData'))
}else{
    tweetsData = data
}

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
        localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
    }
    else if(e.target.dataset.replayptost){
        hadleReplaypost(e.target.dataset.replayptost)
    }
    else if (e.target.dataset.sendreplay){
        handelSendReplay(e.target.dataset.sendreplay)
        handleReplyClick(e.target.dataset.sendreplay)
        localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
    }
    else if (e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
        localStorage.removeItem('tweetsData')
    }
})

function handleDeleteClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    console.log(targetTweetObj.handle)
    if (targetTweetObj.handle === `@Scrimba`){
        const index = tweetsData.indexOf(targetTweetObj)
        tweetsData.splice(index, 1)
        render()
    }else{
        alert(`You can't delete this tweet`)
    }
}

function handelSendReplay(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    const myReplies = {
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        tweetText: document.querySelector(`#inputreplay-${tweetId}`).value}

    targetTweetObj.replies.unshift(myReplies) 
    render()
}

function hadleReplaypost(tweetId){
    const targetTweetObj = document.getElementById(`replayptost-${tweetId}`)
    targetTweetObj.classList.toggle('hidden')
}
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }

        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="replay_post">
                    <i class="fa-solid fa-reply" data-replayptost="${tweet.uuid}"></i>
                </span>
            </div>   
        </div>
        <i class="fa-solid fa-trash" data-delete="${tweet.uuid}"></i>            
    </div>
    <div class="hidden" id="replayptost-${tweet.uuid}">
        <img src="images/scrimbalogo.png" class="profile-pic">
        <input type="text" placeholder="Tweet your reply" class="reply-input" id="inputreplay-${tweet.uuid}"></input>
        <i class="fa-solid fa-paper-plane" data-sendreplay="${tweet.uuid}"></i>
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()


