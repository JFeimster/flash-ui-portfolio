// Update live terminal timestamp
        function updateTime() {
            const now = new Date();
            const timeStr = now.getHours().toString().padStart(2, '0') + ":" + 
                            now.getMinutes().toString().padStart(2, '0') + ":" + 
                            now.getSeconds().toString().padStart(2, '0');
            document.getElementById('timestamp').innerText = "EST. 2024 // " + timeStr;
        }
        setInterval(updateTime, 1000);
        updateTime();