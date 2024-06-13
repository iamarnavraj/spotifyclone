console.log("js")
async function main(){
    let a = await fetch("file:///D:/htmlprojects/spotifyclone/songs/")
    let response = a.text()
    console.log(response)
}

main()