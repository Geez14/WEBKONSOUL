/**
 * Server Management Console - Client Implementation
 * Multi-tab terminal with WebSocket communication
 */

class ServerManagementConsole {
    constructor() {
        this.socket = null;
        this.activeTab = 'main';
        this.tabs = new Map();
        this.commandHistory = [];
        this.historyIndex = -1;
        this.settings = this.loadSettings();
        this.sessionData = [];
        this.connectionTime = null;
        this.platform = 'unknown';
        this.shellType = 'unknown';
        
        // Initialize DOM elements
        this.initializeElements();
        
        // Initialize the console
        this.init();
    }
    
    initializeElements() {
        this.terminal = document.getElementById('terminal');
        this.commandInput = document.getElementById('commandInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.voiceBtn = document.getElementById('voiceBtn');
        this.status = document.getElementById('status');
        this.viewMode = document.getElementById('viewMode');
        this.themeMode = document.getElementById('themeMode');
        this.currentPath = document.getElementById('currentPath');
        this.currentTime = document.getElementById('currentTime');
        this.tabCount = document.getElementById('tabCount');
        this.connectionTimeElement = document.getElementById('connectionTime');
        this.settingsModal = document.getElementById('settingsModal');
        this.suggestions = document.getElementById('suggestions');
        this.saveBtn = document.getElementById('saveBtn');
        this.loadBtn = document.getElementById('loadBtn');
        this.exportBtn = document.getElementById('exportBtn');
    }
    
    init() {
        this.setupEventListeners();
        this.applySettings();
        this.updateClock();
        this.connect();
        
        // Initialize main tab
        this.tabs.set('main', {
            id: 'main',
            title: 'Main Terminal',
            content: '',
            history: [],
            currentPath: this.getDefaultPath(),
            element: document.querySelector('.tab[data-tab="main"]')
        });
        
        // Initialize the default path display
        if (this.currentPath) {
            this.currentPath.textContent = this.getDefaultPath();
        }
        if (this.commandInput) {
            this.commandInput.placeholder = this.getDefaultPrompt();
        }
        
        console.log('🚀 Server Management Console initialized');
    }
    
    detectPlatform(output) {
        if (output.includes('PowerShell')) {
            this.platform = 'windows';
            this.shellType = 'powershell';
        } else if (output.includes('zsh')) {
            this.platform = 'darwin';
            this.shellType = 'zsh';
        } else if (output.includes('bash')) {
            this.platform = 'linux';
            this.shellType = 'bash';
        }
    }
    
    getDefaultPath() {
        // Default paths for different platforms
        switch (this.platform) {
            case 'windows': return 'C:\\';
            case 'darwin': return '/Users';
            case 'linux': return '/home';
            default: return '/';
        }
    }
    
    getDefaultPrompt() {
        // Default prompts for different platforms
        switch (this.shellType) {
            case 'powershell': return `PS ${this.getDefaultPath()}> Enter command...`;
            case 'zsh': return `$ Enter command...`;
            case 'bash': return `$ Enter command...`;
            default: return 'Enter command...';
        }
    }
    
    getPlatformCommands() {
        // Platform-specific command suggestions
        const commonCommands = ['help', 'exit', 'clear'];
        
        switch (this.platform) {
            case 'windows':
                return [...commonCommands, 'Get-Process', 'Get-Service', 'Get-EventLog', 'Set-Location', 
                       'Get-ChildItem', 'dir', 'cd', 'cls', 'ipconfig', 'tasklist', 'systeminfo'];
            case 'darwin':
                return [...commonCommands, 'ls', 'cd', 'pwd', 'ps', 'top', 'ifconfig', 'brew', 'open'];
            case 'linux':
                return [...commonCommands, 'ls', 'cd', 'pwd', 'ps', 'top', 'ifconfig', 'apt', 'systemctl'];
            default:
                return commonCommands;
        }
    }
    
    setupEventListeners() {
        if (!this.commandInput) return;
        
        // Command input
        this.commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.sendCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.handleTabCompletion();
            }
        });
        
        // Font size slider
        const fontSizeSlider = document.getElementById('fontSize');
        const fontSizeValue = document.getElementById('fontSizeValue');
        if (fontSizeSlider && fontSizeValue) {
            fontSizeSlider.addEventListener('input', (e) => {
                const fontSize = e.target.value;
                fontSizeValue.textContent = fontSize + 'px';
                this.updateFontSize(fontSize);
            });
        }
        
        this.commandInput.addEventListener('input', () => {
            this.showSuggestions();
        });
        
        // Buttons
        if (this.sendBtn) this.sendBtn.addEventListener('click', () => this.sendCommand());
        if (this.clearBtn) this.clearBtn.addEventListener('click', () => this.clearTerminal());
        if (this.voiceBtn) this.voiceBtn.addEventListener('click', () => this.toggleVoiceInput());
        if (this.saveBtn) this.saveBtn.addEventListener('click', () => this.saveSession());
        if (this.loadBtn) this.loadBtn.addEventListener('click', () => this.loadSession());
        if (this.exportBtn) this.exportBtn.addEventListener('click', () => this.exportLog());
        
        // View and theme selectors
        if (this.viewMode) this.viewMode.addEventListener('change', (e) => this.changeView(e.target.value));
        if (this.themeMode) this.themeMode.addEventListener('change', (e) => this.changeTheme(e.target.value));
        
        // Click outside to hide suggestions
        document.addEventListener('click', (e) => {
            if (this.suggestions && !this.suggestions.contains(e.target) && e.target !== this.commandInput) {
                this.hideSuggestions();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch (e.key) {
                    case 'l':
                        e.preventDefault();
                        this.clearTerminal();
                        break;
                    case 't':
                        e.preventDefault();
                        this.addNewTab();
                        break;
                    case 'w':
                        e.preventDefault();
                        if (this.activeTab !== 'main') {
                            this.closeTab(this.activeTab);
                        }
                        break;
                }
            }
        });
        
        // Add cleanup when page is closed
        window.addEventListener('beforeunload', () => {
            if (this.socket && this.socket.connected) {
                this.socket.disconnect();
            }
        });
        
        // Add cleanup for visibility changes (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                // Page is hidden, reduce activity
                console.log('🔇 Page hidden, reducing activity');
            } else {
                // Page is visible again
                console.log('👁️ Page visible again');
            }
        });
    }
    
    connect() {
        try {
            console.log('🔄 Attempting to connect to server...');
            this.socket = io();
            
            this.socket.on('connect', () => {
                this.updateStatus('Connected', true);
                this.connectionTime = new Date();
                this.updateConnectionTime();
                if (this.commandInput) this.commandInput.focus();
                console.log('🔗 Connected to server');
                
                // Get initial path for main tab
                setTimeout(() => {
                    if (this.socket && this.socket.connected) {
                        const pathCommand = this.getPathCommand();
                        this.socket.emit('execute-command', { 
                            command: pathCommand, 
                            tabId: 'main' 
                        });
                    }
                }, 500);
            });
            
            this.socket.on('disconnect', () => {
                this.updateStatus('Disconnected', false);
                this.connectionTime = null;
                this.updateConnectionTime();
                console.log('🔌 Disconnected from server');
            });
            
            this.socket.on('terminal-output', (data) => {
                const { tabId, output, type } = data;
                this.appendOutputToTab(tabId, output, type);
                
                // Detect platform from welcome message
                this.detectPlatform(output);
                
                // Update current path if this is the active tab
                if (tabId === this.activeTab) {
                    this.updatePath(output);
                }
            });
            
            // Handle tab events
            this.socket.on('tab-created', (data) => {
                console.log(`📂 Tab created: ${data.tabId}`);
            });
            
            this.socket.on('tab-closed', (data) => {
                console.log(`❌ Tab closed: ${data.tabId}`);
            });
            
            this.socket.on('terminal-error', (data) => {
                const { tabId, error } = data;
                this.appendOutputToTab(tabId, `Error: ${error}\n`, 'error');
                console.error(`❌ Terminal error in tab ${tabId}:`, error);
            });
            
            this.socket.on('terminal-closed', (data) => {
                const { tabId, code } = data;
                this.appendOutputToTab(tabId, `\nTerminal process closed with code ${code}\n`, 'info');
            });
            
            this.socket.on('connect_error', (error) => {
                this.updateStatus('Connection Error', false);
                this.appendOutput(`Connection error: ${error.message}\n`);
                console.error('❌ Connection error:', error);
            });
            
        } catch (error) {
            this.updateStatus('Connection Failed', false);
            this.appendOutput(`Failed to connect: ${error.message}\n`);
            console.error('❌ Failed to connect:', error);
        }
    }
    
    sendCommand() {
        if (!this.commandInput) return;
        
        const command = this.commandInput.value.trim();
        if (!command) return;
        
        if (this.socket && this.socket.connected) {
            // Add to history for current tab
            const tabData = this.tabs.get(this.activeTab) || { history: [] };
            tabData.history = tabData.history || [];
            tabData.history.unshift(command);
            this.historyIndex = -1;
            
            // Limit history size
            if (tabData.history.length > this.settings.maxHistory) {
                tabData.history.pop();
            }
            
            // Update global command history
            this.commandHistory.unshift(command);
            if (this.commandHistory.length > this.settings.maxHistory) {
                this.commandHistory.pop();
            }
            
            // Update tab data
            this.tabs.set(this.activeTab, tabData);
            
            // Add to session data
            this.sessionData.push({
                type: 'command',
                content: command,
                timestamp: new Date().toISOString(),
                tabId: this.activeTab
            });
            
            // Send command to server
            this.socket.emit('execute-command', { 
                command: command, 
                tabId: this.activeTab 
            });
            
            // Check if this is a path-changing command and request current path
            const pathChangingCommands = this.getPathChangingCommands();
            const cmdLower = command.toLowerCase().trim();
            const isPathChangingCommand = pathChangingCommands.some(cmd => 
                cmdLower.startsWith(cmd + ' ') || cmdLower === cmd
            );
            
            // Don't auto-request path for exit commands
            if (isPathChangingCommand && !cmdLower.includes('exit')) {
                // Wait a bit for the command to execute, then get current path
                setTimeout(() => {
                    if (this.socket && this.socket.connected) {
                        const pathCommand = this.getPathCommand();
                        this.socket.emit('execute-command', { 
                            command: pathCommand, 
                            tabId: this.activeTab 
                        });
                    }
                }, 100);
            }
            
            // Clear input and hide suggestions
            this.commandInput.value = '';
            this.hideSuggestions();
            
            console.log(`⚡ Command sent to tab ${this.activeTab}: ${command}`);
        } else {
            this.appendOutput('Error: Not connected to server\n');
            console.error('❌ Not connected to server');
        }
    }
    
    appendOutput(text) {
        this.appendOutputToTab(this.activeTab, text);
    }
    
    appendOutputToTab(tabId, text, type = 'output') {
        // Store output in tab data
        const tabData = this.tabs.get(tabId) || { content: '', history: [] };
        tabData.content = (tabData.content || '') + text;
        this.tabs.set(tabId, tabData);
        
        // Only display if this is the active tab
        if (tabId === this.activeTab && this.terminal) {
            // Apply styling based on type
            let styledText = this.escapeHtml(text);
            
            switch (type) {
                case 'error':
                    styledText = `<span class="error-text">${styledText}</span>`;
                    break;
                case 'success':
                    styledText = `<span class="success-text">${styledText}</span>`;
                    break;
                case 'warning':
                    styledText = `<span class="warning-text">${styledText}</span>`;
                    break;
                case 'info':
                    styledText = `<span class="info-text">${styledText}</span>`;
                    break;
                case 'welcome':
                    styledText = `<span class="welcome-text">${styledText}</span>`;
                    break;
                default:
                    styledText = this.applyColorCoding(styledText);
            }
            
            // Append to terminal
            this.terminal.innerHTML += styledText;
            
            // Auto-scroll if enabled
            if (this.settings.autoScroll) {
                this.scrollToBottom();
            }
            
            // Add to session data
            this.sessionData.push({
                type: 'output',
                content: text,
                timestamp: new Date().toISOString(),
                tabId: tabId
            });
        }
    }
    
    applyColorCoding(text) {
        // Basic color coding for common patterns
        if (text.toLowerCase().includes('error') || text.toLowerCase().includes('exception')) {
            return `<span class="error-text">${text}</span>`;
        } else if (text.toLowerCase().includes('success') || text.toLowerCase().includes('completed')) {
            return `<span class="success-text">${text}</span>`;
        } else if (text.toLowerCase().includes('warning') || text.toLowerCase().includes('warn')) {
            return `<span class="warning-text">${text}</span>`;
        } else if (text.toLowerCase().includes('info') || text.toLowerCase().includes('information')) {
            return `<span class="info-text">${text}</span>`;
        }
        return text;
    }
    
    updatePath(output) {
        // Extract current path from shell output with multiple patterns
        let pathMatch = null;
        let newPath = null;
        
        if (this.shellType === 'powershell') {
            // PowerShell patterns
            pathMatch = output.match(/PS\s+([A-Za-z]:[^>\n]+)>/);
            if (pathMatch) {
                newPath = pathMatch[1].trim();
            }
            
            if (!newPath) {
                pathMatch = output.match(/Directory:\s+(.+)/);
                if (pathMatch) {
                    newPath = pathMatch[1].trim();
                }
            }
            
            if (!newPath) {
                const lines = output.split('\n');
                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine.match(/^[A-Za-z]:[\\\/].*/)) {
                        newPath = trimmedLine;
                        break;
                    }
                }
            }
        } else {
            // Unix-like shell patterns (bash, zsh)
            pathMatch = output.match(/^([\/~][^\s]*)\s*\$$/m);
            if (pathMatch) {
                newPath = pathMatch[1].trim();
            }
            
            if (!newPath) {
                const lines = output.split('\n');
                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('/') || trimmedLine.startsWith('~')) {
                        newPath = trimmedLine;
                        break;
                    }
                }
            }
        }
        
        if (newPath && this.currentPath) {
            // Clean up the path
            newPath = newPath.replace(/\s+$/, '');
            
            this.currentPath.textContent = newPath;
            this.updateTabPath(this.activeTab, newPath);
            
            // Update the command input placeholder
            if (this.commandInput) {
                this.commandInput.placeholder = this.getPromptForPath(newPath);
            }
            
            console.log(`📍 Current path updated: ${newPath}`);
        }
    }
    
    getPromptForPath(path) {
        switch (this.shellType) {
            case 'powershell': return `PS ${path}> Enter command...`;
            case 'zsh': return `zsh:${path}$ Enter command...`;
            case 'bash': return `bash:${path}$ Enter command...`;
            default: return `${path}$ Enter command...`;
        }
    }
    
    getPathChangingCommands() {
        switch (this.platform) {
            case 'windows':
                return ['cd', 'set-location', 'sl', 'pushd', 'popd', 'chdir'];
            case 'darwin':
            case 'linux':
                return ['cd', 'pushd', 'popd'];
            default:
                return ['cd'];
        }
    }
    
    getPathCommand() {
        switch (this.shellType) {
            case 'powershell': return 'Get-Location | Select-Object -ExpandProperty Path';
            case 'zsh':
            case 'bash': return 'pwd';
            default: return 'pwd';
        }
    }
    
    updateTabPath(tabId, path) {
        // Store the current path for each tab
        const tabData = this.tabs.get(tabId);
        if (tabData) {
            tabData.currentPath = path;
            this.tabs.set(tabId, tabData);
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    scrollToBottom() {
        if (this.terminal) {
            this.terminal.scrollTop = this.terminal.scrollHeight;
        }
    }
    
    clearTerminal() {
        if (this.activeTab && this.tabs.has(this.activeTab)) {
            const tabData = this.tabs.get(this.activeTab);
            tabData.content = '';
            this.tabs.set(this.activeTab, tabData);
        }
        if (this.terminal) {
            this.terminal.innerHTML = '';
        }
        console.log('🧹 Terminal cleared');
    }
    
    updateStatus(message, connected) {
        if (this.status) {
            this.status.textContent = message;
            this.status.className = `status ${connected ? 'status-connected' : 'status-disconnected'}`;
        }
    }
    
    navigateHistory(direction) {
        if (!this.commandInput) return;
        
        const tabData = this.tabs.get(this.activeTab);
        const history = tabData?.history || this.commandHistory;
        
        if (history.length === 0) return;
        
        if (direction === 'up') {
            this.historyIndex = Math.min(this.historyIndex + 1, history.length - 1);
        } else {
            this.historyIndex = Math.max(this.historyIndex - 1, -1);
        }
        
        if (this.historyIndex >= 0) {
            this.commandInput.value = history[this.historyIndex];
        } else {
            this.commandInput.value = '';
        }
    }
    
    showSuggestions() {
        if (!this.commandInput || !this.suggestions) return;
        
        const input = this.commandInput.value.toLowerCase();
        if (input.length < 2) {
            this.hideSuggestions();
            return;
        }
        
        const suggestions = this.getCommandSuggestions(input);
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        this.suggestions.innerHTML = '';
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = suggestion;
            item.addEventListener('click', () => {
                this.commandInput.value = suggestion;
                this.hideSuggestions();
                this.commandInput.focus();
            });
            this.suggestions.appendChild(item);
        });
        
        this.suggestions.classList.remove('hidden');
    }
    
    hideSuggestions() {
        if (this.suggestions) {
            this.suggestions.classList.add('hidden');
        }
    }
    
    getCommandSuggestions(input) {
        const suggestions = this.getPlatformCommands();
        
        return suggestions
            .filter(cmd => cmd.toLowerCase().includes(input))
            .slice(0, 5);
    }
    
    handleTabCompletion() {
        if (!this.commandInput) return;
        
        const input = this.commandInput.value;
        const suggestions = this.getCommandSuggestions(input.toLowerCase());
        
        if (suggestions.length === 1) {
            this.commandInput.value = suggestions[0];
        } else if (suggestions.length > 1) {
            this.showSuggestions();
        }
    }
    
    // Tab Management
    addNewTab() {
        const tabId = 'tab_' + Date.now();
        const tabTitle = `Terminal ${this.tabs.size}`;
        
        // Create tab data
        this.tabs.set(tabId, {
            id: tabId,
            title: tabTitle,
            content: '',
            history: [],
            currentPath: this.getDefaultPath(),
            element: null
        });
        
        // Create tab element
        this.createTabElement(tabId, tabTitle);
        
        // Request server to create new terminal process
        if (this.socket && this.socket.connected) {
            this.socket.emit('create-tab', { tabId });
            
            // Get initial path for new tab
            setTimeout(() => {
                if (this.socket && this.socket.connected) {
                    const pathCommand = this.getPathCommand();
                    this.socket.emit('execute-command', { 
                        command: pathCommand, 
                        tabId: tabId 
                    });
                }
            }, 300);
        }
        
        // Switch to new tab
        this.switchToTab(tabId);
        this.updateTabCount();
        
        console.log(`📂 Created new tab: ${tabId}`);
    }
    
    createTabElement(tabId, title) {
        const tabsContainer = document.querySelector('.terminal-tabs');
        const addButton = document.querySelector('.tab-add');
        
        if (!tabsContainer || !addButton) return;
        
        const tabElement = document.createElement('div');
        tabElement.className = 'tab';
        tabElement.setAttribute('data-tab', tabId);
        tabElement.onclick = () => this.switchToTab(tabId);
        
        tabElement.innerHTML = `
            <span class="tab-title">${title}</span>
            <span class="tab-close" onclick="event.stopPropagation(); closeTab('${tabId}')">&times;</span>
        `;
        
        // Insert before add button
        tabsContainer.insertBefore(tabElement, addButton);
        
        // Update tab data
        const tabData = this.tabs.get(tabId);
        if (tabData) {
            tabData.element = tabElement;
            this.tabs.set(tabId, tabData);
        }
    }
    
    switchToTab(tabId) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to selected tab
        const targetTab = document.querySelector(`[data-tab="${tabId}"]`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        // Save current terminal content and path
        if (this.activeTab && this.tabs.has(this.activeTab) && this.terminal) {
            const currentTabData = this.tabs.get(this.activeTab);
            currentTabData.content = this.terminal.innerHTML;
            this.tabs.set(this.activeTab, currentTabData);
        }
        
        // Load new tab content
        this.activeTab = tabId;
        if (this.tabs.has(tabId)) {
            const tabData = this.tabs.get(tabId);
            if (this.terminal) {
                this.terminal.innerHTML = tabData.content || '';
            }
            this.commandHistory = [...(tabData.history || [])];
            this.historyIndex = -1;
            
            // Restore the path for this tab
            if (tabData.currentPath && this.currentPath) {
                this.currentPath.textContent = tabData.currentPath;
                if (this.commandInput) {
                    this.commandInput.placeholder = this.getPromptForPath(tabData.currentPath);
                }
            } else {
                // Default path display
                if (this.currentPath) {
                    this.currentPath.textContent = this.getDefaultPath();
                }
                if (this.commandInput) {
                    this.commandInput.placeholder = this.getDefaultPrompt();
                }
            }
        }
        
        // Notify server about tab switch
        if (this.socket && this.socket.connected) {
            this.socket.emit('switch-tab', { tabId });
        }
        
        this.scrollToBottom();
        if (this.commandInput) this.commandInput.focus();
        
        console.log(`🔄 Switched to tab: ${tabId}`);
    }
    
    closeTab(tabId) {
        if (tabId === 'main') return; // Don't close main tab
        
        const tabData = this.tabs.get(tabId);
        if (!tabData) return;
        
        // Notify server to close terminal process
        if (this.socket && this.socket.connected) {
            this.socket.emit('close-tab', { tabId });
        }
        
        // Remove tab element
        if (tabData.element) {
            tabData.element.remove();
        }
        
        // Remove from tabs map
        this.tabs.delete(tabId);
        
        // Switch to main tab if this was active
        if (this.activeTab === tabId) {
            this.switchToTab('main');
        }
        
        this.updateTabCount();
        console.log(`❌ Closed tab: ${tabId}`);
    }
    
    updateTabCount() {
        if (this.tabCount) {
            const count = this.tabs.size;
            this.tabCount.textContent = `${count} tab${count !== 1 ? 's' : ''}`;
        }
    }
    
    // Theme and View Management
    changeTheme(theme) {
        document.body.className = `theme-${theme}`;
        this.settings.theme = theme;
        this.saveSettings();
        console.log(`🎨 Changed theme to: ${theme}`);
    }
    
    changeView(view) {
        document.body.classList.remove('view-desktop', 'view-mobile', 'view-fullscreen');
        document.body.classList.add(`view-${view}`);
        this.settings.view = view;
        this.saveSettings();
        console.log(`📱 Changed view to: ${view}`);
    }
    
    // Settings Management
    loadSettings() {
        try {
            const saved = localStorage.getItem('smc-settings');
            return saved ? JSON.parse(saved) : {
                theme: 'dark',
                view: 'desktop',
                fontSize: 13,
                autoScroll: true,
                soundEnabled: true,
                maxHistory: 100
            };
        } catch (error) {
            console.error('❌ Failed to load settings:', error);
            return {
                theme: 'dark',
                view: 'desktop',
                fontSize: 13,
                autoScroll: true,
                soundEnabled: true,
                maxHistory: 100
            };
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('smc-settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('❌ Failed to save settings:', error);
        }
    }
    
    applySettings() {
        // Apply theme
        this.changeTheme(this.settings.theme);
        if (this.themeMode) this.themeMode.value = this.settings.theme;
        
        // Apply view
        this.changeView(this.settings.view);
        if (this.viewMode) this.viewMode.value = this.settings.view;
        
        // Apply font size
        this.updateFontSize(this.settings.fontSize);
        
        // Update settings modal values
        this.updateSettingsModal();
    }
    
    updateFontSize(fontSize) {
        this.settings.fontSize = parseInt(fontSize);
        if (this.terminal) {
            this.terminal.style.fontSize = `${fontSize}px`;
        }
        if (this.commandInput) {
            this.commandInput.style.fontSize = `${fontSize}px`;
        }
    }
    
    updateSettingsModal() {
        const fontSizeSlider = document.getElementById('fontSize');
        const fontSizeValue = document.getElementById('fontSizeValue');
        const autoScrollCheckbox = document.getElementById('autoScroll');
        const soundEnabledCheckbox = document.getElementById('soundEnabled');
        const maxHistoryInput = document.getElementById('maxHistory');
        
        if (fontSizeSlider) fontSizeSlider.value = this.settings.fontSize;
        if (fontSizeValue) fontSizeValue.textContent = this.settings.fontSize + 'px';
        if (autoScrollCheckbox) autoScrollCheckbox.checked = this.settings.autoScroll;
        if (soundEnabledCheckbox) soundEnabledCheckbox.checked = this.settings.soundEnabled;
        if (maxHistoryInput) maxHistoryInput.value = this.settings.maxHistory;
    }
    
    // Utility functions
    updateClock() {
        setInterval(() => {
            if (this.currentTime) {
                this.currentTime.textContent = new Date().toLocaleTimeString();
            }
        }, 1000);
    }
    
    updateConnectionTime() {
        if (this.connectionTimeElement) {
            if (this.connectionTime) {
                const duration = Math.floor((new Date() - this.connectionTime) / 1000);
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;
                this.connectionTimeElement.textContent = 
                    `Connected for ${minutes}:${seconds.toString().padStart(2, '0')}`;
            } else {
                this.connectionTimeElement.textContent = 'Not connected';
            }
        }
        
        setTimeout(() => this.updateConnectionTime(), 1000);
    }
    
    // Session Management
    saveSession() {
        try {
            const sessionData = {
                tabs: Array.from(this.tabs.entries()).map(([id, data]) => ({
                    id,
                    title: data.title,
                    content: data.content,
                    history: data.history
                })),
                activeTab: this.activeTab,
                sessionData: this.sessionData,
                timestamp: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `smc-session-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            console.log('💾 Session saved');
        } catch (error) {
            console.error('❌ Failed to save session:', error);
        }
    }
    
    loadSession() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const sessionData = JSON.parse(e.target.result);
                        this.restoreSession(sessionData);
                        console.log('📂 Session loaded');
                    } catch (error) {
                        console.error('❌ Failed to load session:', error);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
    
    restoreSession(sessionData) {
        // Clear existing tabs (except main)
        this.tabs.forEach((_, tabId) => {
            if (tabId !== 'main') {
                this.closeTab(tabId);
            }
        });
        
        // Restore tabs
        sessionData.tabs.forEach(tabData => {
            if (tabData.id !== 'main') {
                this.tabs.set(tabData.id, {
                    id: tabData.id,
                    title: tabData.title,
                    content: tabData.content,
                    history: tabData.history || [],
                    element: null
                });
                this.createTabElement(tabData.id, tabData.title);
            } else {
                // Update main tab
                const mainTab = this.tabs.get('main');
                if (mainTab) {
                    mainTab.content = tabData.content;
                    mainTab.history = tabData.history || [];
                    this.tabs.set('main', mainTab);
                }
            }
        });
        
        // Switch to the previously active tab
        this.switchToTab(sessionData.activeTab || 'main');
        this.updateTabCount();
    }
    
    exportLog() {
        try {
            const logData = this.sessionData
                .map(entry => `[${entry.timestamp}] [${entry.tabId}] ${entry.type.toUpperCase()}: ${entry.content}`)
                .join('\n');
            
            const blob = new Blob([logData], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `smc-log-${new Date().toISOString().split('T')[0]}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            
            console.log('📄 Log exported');
        } catch (error) {
            console.error('❌ Failed to export log:', error);
        }
    }
    
    toggleVoiceInput() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            recognition.onresult = (event) => {
                const command = event.results[0][0].transcript;
                if (this.commandInput) {
                    this.commandInput.value = command;
                }
                console.log(`🎤 Voice input: ${command}`);
            };
            
            recognition.onerror = (event) => {
                console.error('❌ Voice recognition error:', event.error);
            };
            
            recognition.start();
        } else {
            console.warn('⚠️ Speech recognition not supported');
        }
    }
}

// Global functions for HTML onclick handlers
function switchToTab(tabId) {
    if (window.serverConsole) {
        window.serverConsole.switchToTab(tabId);
    }
}

function closeTab(tabId) {
    if (window.serverConsole) {
        window.serverConsole.closeTab(tabId);
    }
}

function addNewTab() {
    if (window.serverConsole) {
        window.serverConsole.addNewTab();
    }
}

function getSystemInfo() {
    if (window.serverConsole && window.serverConsole.socket && window.serverConsole.socket.connected) {
        let command;
        switch (window.serverConsole.platform) {
            case 'windows':
                command = 'systeminfo | Select-String "OS Name","Total Physical Memory","Available Physical Memory","Processor"';
                break;
            case 'darwin':
                command = 'system_profiler SPSoftwareDataType SPHardwareDataType';
                break;
            case 'linux':
                command = 'uname -a && free -h && lscpu | head -10';
                break;
            default:
                command = 'uname -a';
        }
        
        window.serverConsole.socket.emit('execute-command', { 
            command: command, 
            tabId: window.serverConsole.activeTab 
        });
    }
}

function getPerformanceInfo() {
    if (window.serverConsole && window.serverConsole.socket && window.serverConsole.socket.connected) {
        let command;
        switch (window.serverConsole.platform) {
            case 'windows':
                command = 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 Name,CPU,WorkingSet';
                break;
            case 'darwin':
                command = 'top -l 1 -n 10 -o cpu';
                break;
            case 'linux':
                command = 'ps aux --sort=-%cpu | head -11';
                break;
            default:
                command = 'ps aux | head -10';
        }
        
        window.serverConsole.socket.emit('execute-command', { 
            command: command, 
            tabId: window.serverConsole.activeTab 
        });
    }
}

function openSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.remove('hidden');
        // Update the settings modal with current values
        if (window.serverConsole) {
            window.serverConsole.updateSettingsModal();
        }
    }
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function saveSettings() {
    if (window.serverConsole) {
        // Update settings from form
        const fontSize = document.getElementById('fontSize');
        const autoScroll = document.getElementById('autoScroll');
        const soundEnabled = document.getElementById('soundEnabled');
        const maxHistory = document.getElementById('maxHistory');
        
        if (fontSize) window.serverConsole.settings.fontSize = parseInt(fontSize.value);
        if (autoScroll) window.serverConsole.settings.autoScroll = autoScroll.checked;
        if (soundEnabled) window.serverConsole.settings.soundEnabled = soundEnabled.checked;
        if (maxHistory) window.serverConsole.settings.maxHistory = parseInt(maxHistory.value);
        
        window.serverConsole.saveSettings();
        window.serverConsole.applySettings();
        closeSettings();
        
        console.log('⚙️ Settings saved');
    }
}

// Initialize the console when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.serverConsole = new ServerManagementConsole();
    console.log('🚀 Server Management Console ready');
});
