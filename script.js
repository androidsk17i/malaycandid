document.addEventListener('DOMContentLoaded', () => {
    // Get all the necessary elements
    const subject = document.getElementById('subject');
    const clothing = document.getElementById('clothing');
    const action = document.getElementById('action');
    const setting = document.getElementById('setting');
    const shotType = document.getElementById('shotType');
    const style = document.getElementById('style');
    const lighting = document.getElementById('lighting');
    const aesthetic = document.getElementById('aesthetic');
    const mood = document.getElementById('mood');
    const output = document.getElementById('output');
    const copyButton = document.getElementById('copyButton');
    const randomButton = document.getElementById('randomButton');

    // Function to get selected values from multiple select
    const getSelectedValues = (select) => {
        const selected = Array.from(select.selectedOptions).map(option => option.value);
        // Return only the first selected value
        return selected.slice(0, 1);
    };

    // Function to get random items from array
    const getRandomItems = (arr, count) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    // Function to select random options in a select element
    const selectRandomOptions = (select) => {
        // Clear current selections
        Array.from(select.options).forEach(option => option.selected = false);
        
        // Get just one random option
        const options = Array.from(select.options);
        const randomOption = options[Math.floor(Math.random() * options.length)];
        
        // Select the random option
        if (randomOption) {
            randomOption.selected = true;
        }
    };

    // Function to copy text to clipboard and show feedback
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            copyButton.textContent = 'Copied!';
            copyButton.style.backgroundColor = '#27ae60';
            
            setTimeout(() => {
                copyButton.textContent = 'Copy to Clipboard';
                copyButton.style.backgroundColor = '#2c3e50';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            copyButton.textContent = 'Failed to copy';
            copyButton.style.backgroundColor = '#e74c3c';
            
            setTimeout(() => {
                copyButton.textContent = 'Copy to Clipboard';
                copyButton.style.backgroundColor = '#2c3e50';
            }, 2000);
        }
    };

    // Function to remove duplicate words while preserving sentence structure
    const removeDuplicateWords = (text) => {
        // Split the text into segments (by commas)
        const segments = text.split(',').map(segment => segment.trim());
        
        // Process each segment to remove duplicates while preserving structure
        const processedSegments = segments.map(segment => {
            // Split the segment into words
            const words = segment.split(' ');
            const seen = new Set();
            
            // Filter out duplicate words while preserving articles, conjunctions, and prepositions
            return words.filter(word => {
                // Always keep these words
                const keepWords = ['a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'with', 'while', 'by', 'to', 'of'];
                if (keepWords.includes(word.toLowerCase())) return true;
                
                // Convert to lowercase for comparison but keep original case in result
                const lowerWord = word.toLowerCase();
                if (seen.has(lowerWord)) return false;
                seen.add(lowerWord);
                return true;
            }).join(' ');
        });
        
        // Join segments back together
        return processedSegments.join(', ');
    };

    // Event handler for selection changes
    const handleSelectionChange = (select) => {
        const selected = Array.from(select.selectedOptions);
        // If more than one option is selected, keep only the last selected one
        if (selected.length > 1) {
            selected.forEach((option, index) => {
                if (index !== selected.length - 1) {
                    option.selected = false;
                }
            });
        }
        generatePrompt();
    };

    // Function to generate the prompt
    const generatePrompt = () => {
        const selectedClothing = getSelectedValues(clothing);
        const selectedActions = getSelectedValues(action);
        const selectedSettings = getSelectedValues(setting);
        const selectedShotTypes = getSelectedValues(shotType);
        const selectedStyles = getSelectedValues(style);
        const selectedLighting = getSelectedValues(lighting);
        const selectedAesthetics = getSelectedValues(aesthetic);
        const selectedMoods = getSelectedValues(mood);

        let prompt = subject.value;

        // Add shot type first if selected
        if (selectedShotTypes.length > 0) {
            prompt += `, ${selectedShotTypes[0]}`;
        }

        // Add clothing if selected
        if (selectedClothing.length > 0) {
            prompt += ` wearing ${selectedClothing[0]}`;
        }

        // Add actions if selected
        if (selectedActions.length > 0) {
            prompt += `, ${selectedActions[0]}`;
        }

        // Add settings if selected
        if (selectedSettings.length > 0) {
            prompt += ` in ${selectedSettings[0]}`;
        }

        // Add styles if selected
        if (selectedStyles.length > 0) {
            prompt += `, ${selectedStyles[0]} style`;
        }

        // Add lighting if selected
        if (selectedLighting.length > 0) {
            prompt += `, with ${selectedLighting[0]} lighting`;
        }

        // Add aesthetics if selected
        if (selectedAesthetics.length > 0) {
            prompt += `, ${selectedAesthetics[0]} aesthetic`;
        }

        // Add moods if selected
        if (selectedMoods.length > 0) {
            prompt += `, ${selectedMoods[0]} mood`;
        }

        // Add final touches
        prompt += `, high quality, 4k, detailed`;

        // Remove duplicate words while preserving sentence structure
        prompt = removeDuplicateWords(prompt);

        output.value = prompt;
        
        // Automatically copy to clipboard
        copyToClipboard(prompt);
    };

    // Function to generate random selections
    const generateRandomSelections = () => {
        selectRandomOptions(clothing);
        selectRandomOptions(action);
        selectRandomOptions(setting);
        selectRandomOptions(shotType);
        selectRandomOptions(style);
        selectRandomOptions(lighting);
        selectRandomOptions(aesthetic);
        selectRandomOptions(mood);
        generatePrompt();
    };

    // Add event listeners to all select elements
    [clothing, action, setting, shotType, style, lighting, aesthetic, mood].forEach(select => {
        select.addEventListener('change', () => handleSelectionChange(select));
    });

    // Add event listener to random button
    randomButton.addEventListener('click', generateRandomSelections);

    // Copy button functionality
    copyButton.addEventListener('click', () => copyToClipboard(output.value));

    // Generate initial prompt
    generatePrompt();
}); 