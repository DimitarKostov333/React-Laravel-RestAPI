export const login = async() => {
    try{
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
    
            const formData = new FormData();
            formData.append("email", "chonk@gmail.com");
            formData.append("password", "password");
    
            xhr.open('POST', 'http://localhost/morecorp-api/public/api/login');
            xhr.addEventListener('load', () => {
                let jsonResponse = JSON.parse(xhr.responseText);
                
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(jsonResponse.access_token);
                } else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }
    
            });
    
            xhr.onerror = function () {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            };

            xhr.send(formData);
    
        });
    }catch{
        throw new Error("Could not authenticate api.");
    }
}
