function toggleView(filter) {
            // Update active state of filter pills
            const buttons = document.querySelectorAll('.control-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            
            // Highlight target button
            const eventTarget = window.event ? window.event.target : null;
            if (eventTarget) {
                eventTarget.classList.add('active');
            }

            // Target column elements
            const col1 = document.querySelectorAll('.path-column-1');
            const col2 = document.querySelectorAll('.path-column-2');
            const col3 = document.querySelectorAll('.path-column-3');
            const grid = document.querySelector('.matrix-grid');

            // Reset transitions and visibility
            if (filter === 'all') {
                grid.style.gridTemplateColumns = '280px repeat(3, 1fr)';
                showColumns([col1, col2, col3]);
            } else if (filter === 'dilutive') {
                grid.style.gridTemplateColumns = '280px 1fr 0px 0px';
                showColumns([col1]);
                hideColumns([col2, col3]);
            } else if (filter === 'non-dilutive') {
                grid.style.gridTemplateColumns = '280px 0px 1fr 1fr';
                showColumns([col2, col3]);
                hideColumns([col1]);
            }
        }

        function showColumns(columnsArray) {
            columnsArray.forEach(col => {
                col.forEach(el => {
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                    el.style.pointerEvents = 'auto';
                    el.style.paddingLeft = '';
                    el.style.paddingRight = '';
                    el.style.borderRightWidth = '';
                });
            });
        }

        function hideColumns(columnsArray) {
            columnsArray.forEach(col => {
                col.forEach(el => {
                    el.style.opacity = '0';
                    el.style.visibility = 'hidden';
                    el.style.pointerEvents = 'none';
                    el.style.paddingLeft = '0';
                    el.style.paddingRight = '0';
                    el.style.borderRightWidth = '0';
                });
            });
        }