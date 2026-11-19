const states = [true, true, true];

        function toggleColumn(index) {
            const col = document.getElementById(`path-col-${index}`);
            const btn = document.querySelector(`.path-${index}-btn`);
            
            // Toggle local state
            states[index] = !states[index];
            
            if (states[index]) {
                col.classList.remove('collapsed');
                btn.classList.add('active');
            } else {
                col.classList.add('collapsed');
                btn.classList.remove('active');
            }

            // Update visible counter
            const activeCountText = document.getElementById('active-count');
            const trueCount = states.filter(Boolean).length;
            activeCountText.innerText = `${trueCount}/3`;
            
            // Adjust visual grid sizing depending on hidden items
            const grid = document.querySelector('.comparison-grid');
            if (window.innerWidth > 992) {
                let columnsPattern = "280px";
                for (let i = 0; i < 3; i++) {
                    columnsPattern += " 1fr";
                }
                grid.style.gridTemplateColumns = columnsPattern;
            }
        }