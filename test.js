function foo() {
    setTimeout(function() {
        console.log("foooo");
    }, 1000);
}

function bar() {
    setTimeout(function() {
        console.log("baaar");
    }, 2000);
}

async () => {  
    await bar();
    foo();
}


