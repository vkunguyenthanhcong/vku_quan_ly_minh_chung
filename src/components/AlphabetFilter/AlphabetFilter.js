import React from 'react';

// Alphabet Array from A to Z
const StandardFilter = ({ activeStandard, getNumber, soLuongTieuChuan }) => {
    // Dynamically generate the standards array based on the number of standards
    const standards = Array.from({ length: soLuongTieuChuan }, (_, i) => `Tiêu Chuẩn ${i + 1}`);

    // Handle button click to update the hash and possibly trigger filtering
    const handleFilter = (standard, getNumber) => {
        const standardNumber = standard.match(/\d+/)[0]; // Extract the number from the standard
        window.location.hash = `#tieuChuan-${standardNumber}`; // Update the URL hash

        if (getNumber) {
            getNumber(standardNumber); // Optionally call getNumber to handle custom filtering logic
        }
    };

    return (
        <div style={styles.standardContainer}>
            {standards.map((standard) => {
                // Extract number for comparison from the standard
                const standardNumber = standard.match(/\d+/)[0];
                const isActive = activeStandard === `#tieuChuan-${standardNumber}`; // Compare with active standard

                return (
                    <button
                        key={standard}
                        style={{
                            ...styles.standardButton,
                            backgroundColor: isActive ? '#4CAF50' : '#f1f1f1', // Change color if active
                            color: isActive ? 'white' : 'black',
                        }}
                        onClick={() => handleFilter(standard, getNumber)} // Pass standard and getNumber to handleFilter
                    >
                        {standard}
                    </button>
                );
            })}
        </div>
    );
};
const handleFilter = (standard, getNumber) => {

    const standardNumber = standard.match(/\d+/)[0];
    window.location.hash = `#tieuChuan-${standardNumber}`;
    getNumber();
};

const styles = {
    appContainer: {
        display: 'flex',
    },
    standardContainer: {
        position: 'fixed',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        maxHeight: '80vh', // Limit height for scroll
        overflowY: 'auto', // Enable scroll if content overflows
        width: '120px', // Adjust the width to make buttons more compact
    },
    standardButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '12px',
        padding: '6px',
        borderRadius: '4px',
        width: '100%', // Make buttons fill the container width
        textAlign: 'center',
        margin: '2px 0', // Add margin between buttons
    },
    itemsContainer: {
        margin: '20px',
        padding: '20px',
        flex: 1,
        maxWidth: '80%', // Limit the width of the items container
    },
};

export default StandardFilter;
