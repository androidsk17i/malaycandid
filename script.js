document.addEventListener('DOMContentLoaded', () => {
    // Get all the necessary elements
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
    const subjectType = document.getElementById('subjectType');
    const singleSubject = document.getElementById('singleSubject');
    const groupSubject = document.getElementById('groupSubject');

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

    // Function to handle subject type change
    function handleSubjectTypeChange() {
        if (subjectType.value === 'single') {
            singleSubject.style.display = 'block';
            groupSubject.style.display = 'none';
        } else {
            singleSubject.style.display = 'none';
            groupSubject.style.display = 'block';
        }
        generatePrompt();
    }

    // Function to generate the prompt
    const generatePrompt = () => {
        const currentSubject = subjectType.value === 'single' ? singleSubject.value : groupSubject.value;
        const selectedClothing = getSelectedValues(clothing);
        const selectedAction = getSelectedValues(action);
        const selectedSetting = getSelectedValues(setting);
        const selectedShotType = getSelectedValues(shotType);
        const selectedStyle = getSelectedValues(style);
        const selectedLighting = getSelectedValues(lighting);
        const selectedAesthetic = getSelectedValues(aesthetic);
        const selectedMood = getSelectedValues(mood);

        let prompt = currentSubject;

        if (selectedShotType.length) prompt += `, ${selectedShotType[0]}`;
        if (selectedClothing.length) prompt += `, wearing ${selectedClothing[0]}`;
        if (selectedAction.length) prompt += `, ${selectedAction[0]}`;
        if (selectedSetting.length) prompt += `, in ${selectedSetting[0]}`;
        if (selectedStyle.length) prompt += `, ${selectedStyle[0]} style`;
        if (selectedLighting.length) prompt += `, with ${selectedLighting[0]} lighting`;
        if (selectedAesthetic.length) prompt += `, ${selectedAesthetic[0]} aesthetic`;
        if (selectedMood.length) prompt += `, ${selectedMood[0]} mood`;

        // Add final touches
        prompt += `, high quality, 4k, detailed`;

        // Remove duplicate words while preserving sentence structure
        prompt = removeDuplicateWords(prompt);

        // Set the output value
        output.value = prompt;

        // Automatically copy to clipboard
        copyToClipboard(prompt);
    };

    // Function to generate random selections
    const generateRandomSelections = () => {
        // Randomly select subject type
        subjectType.value = Math.random() < 0.5 ? 'single' : 'group';
        handleSubjectTypeChange();

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

    // Add event listener for subject type change
    subjectType.addEventListener('change', handleSubjectTypeChange);

    // Generate initial prompt
    handleSubjectTypeChange();
    generatePrompt();
}); 