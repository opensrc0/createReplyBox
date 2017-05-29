let imgPath = 'assets/images/';

function submitComment (event) {
    var userName = document.querySelector("#name").value.trim();
    var comment  = document.querySelector("#msg").value.trim();
    if(event.keyCode != 13 || !userName || !comment) {
        return false;
    }
    
    let addCommets = new addComment(userName, comment);
    var commentList = JSON.parse(localStorage.getItem("commentList")) || [];
    printComment(commentList);

    document.querySelector("#name").value = '';
    document.querySelector("#msg").value = '';
}

function submitCommetToComment (event, userNameId, commentId, index) {
    var userName = document.querySelector("#"+userNameId).value.trim();
    var comment  = document.querySelector("#"+commentId).value.trim();
    if(event.keyCode != 13 || !userName || !comment) {
        return false;
    }
    var commentList = JSON.parse(localStorage.getItem("commentList"))[index] || [];
    let addCommets = new addComment(userName, comment, commentList, index);

    printComment(commentList, index);

    document.querySelector("#"+userNameId).value = '';
    document.querySelector("#"+commentId).value = '';
}

function addComment (userName, comment, commentListData, index) {
    var obj = {};
    var commentList = commentListData || JSON.parse(localStorage.getItem("commentList")) || [];
    obj.userName = userName;
    obj.comment = comment;
    obj.commentList = [];
    obj.like = 0;
    obj.date = new Date();
    if(!commentListData) {
        commentList.push(obj);
        localStorage.setItem('commentList', JSON.stringify(commentList));
    } else {
        commentList.commentList.push(obj);
        var commentListMain = JSON.parse(localStorage.getItem("commentList")) || [];
        commentListMain[index]['commentList'].push(commentList);
        localStorage.setItem('commentList', JSON.stringify(commentListMain));
    }
}

function getPrintingDate (initialDate) {
    var _initial = initialDate;
    var fromTime = new Date(_initial);
    var toTime = new Date();

    var differenceTravel = toTime.getTime() - fromTime.getTime();
    var seconds = Math.floor((differenceTravel) / (1000));

    if(seconds < 60) {
        return 'a second ago';
    } else if(seconds > 60 && seconds < 3600) {
        return parseInt(seconds/60)+' min ago';
    } else if(seconds > 3600) {
        return parseInt(seconds/60*60) + 'days ago';
    }
}

function printComment (commentListData,index) {
    if(!index && index!=0) {
        var commentList = commentListData &&  commentListData.reverse();
        var index = '';
    } else {
        var commentList = commentListData.commentList && commentListData.commentList.reverse();
        var index = index;
    }
    
    var commentListHtml = '';
    for(let i in commentList) {
        let time = getPrintingDate(commentList[i].date);
        commentListHtml += `
            <div class="commentDiv">
                <div>
                    <div class="bold floatLeft">${commentList[i].userName}</div>
                    <div class="floatLeft time"> ${time}</div>
                    <div class="clearfix"></div>
                </div>
                <div class="comment"> ${commentList[i].comment}</div>
                <div class="likeShare"> 
                    ${commentList[i].like}
                    <img src="${imgPath}arrow-up.png" class="uplike icon">
                    <img src="${imgPath}arrow-down.png" class="downlike icon">
                    <label class="reply">Reply</label>
                    <div class="commetToCommentBox ng-hide">
                        <input type="text" name="userName${commentList.length - i - 1}" placeholder="Enter Name" id="name${commentList.length - i -1}">
                        <textarea placeholder="Join the discussion" onkeypress="submitCommetToComment(event, 'name${commentList.length - i -1 }', 'msg${commentList.length - i -1}', ${commentList.length - i -1})" id="msg${commentList.length - i -1}"></textarea>
                    </div>
                    <div id="commentList${commentList.length - i - 1}"></div>
                </div>
                <div class="clearfix"></div>
            </div>`;
        
    }
    document.querySelector("#commentList"+index).innerHTML = commentListHtml;
    var updownLikes = new updownLike();
    updownLikes.uplike();
    updownLikes.downlike();
    updownLikes.reply();
}

var commentList = JSON.parse(localStorage.getItem("commentList")) || [];
printComment(commentList);

function updownLike () {

    this.uplike = function () {
        var uplike =document.querySelectorAll('.uplike');
        for(let i=0;i<uplike.length;i++){
            uplike[i].addEventListener('click', function(){
                var commentList = JSON.parse(localStorage.getItem("commentList"));
                commentList[uplike.length-i-1].like = parseInt(commentList[uplike.length-i-1].like) + 1;
                localStorage.setItem('commentList', JSON.stringify(commentList));
                printComment(commentList);
                this.parentNode.children[3].classList.remove('ng-hide');
            });
        }
    }

    this.downlike = function () {
        var downlike =document.querySelectorAll('.downlike');
        for(let j=0;j<downlike.length;j++){
        downlike[j].addEventListener('click', function(){
                var commentList = JSON.parse(localStorage.getItem("commentList"));
                if(parseInt(commentList[downlike.length-j-1].like) <= 0) {
                    return false;
                }
                commentList[downlike.length-j-1].like = parseInt(commentList[downlike.length-j-1].like) - 1;
                localStorage.setItem('commentList', JSON.stringify(commentList));
                printComment(commentList);
                this.parentNode.children[3].classList.remove('ng-hide');
            });
        }
    }

    this.reply = function () {
        var reply =document.querySelectorAll('.reply');
        for(let k=0;k<reply.length;k++){
            reply[k].addEventListener('click', function(){
                this.parentNode.children[3].classList.remove('ng-hide');
            });
        }
    }

    return {
        uplike : this.uplike,
        downlike : this.downlike,
        reply : this.reply
    }
}
