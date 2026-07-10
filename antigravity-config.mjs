import readline from 'readline';
import { loadJson, saveJson, loadAuth, refreshAuthToken, CONFIG_FILE, AUTH_FILE } from './auth-utils.mjs';

const AVAILABLE_MODELS = [
  'gemini-3.1-pro-low',
  'gemini-3.1-pro-high',
  'gpt-oss-120b-medium',
  'gemini-3-flash',
  'claude-opus-4-6-thinking',
  'claude-opus-4-5-thinking',
  'claude-sonnet-4-5',
  'claude-sonnet-4-6',
  'claude-sonnet-4-5-thinking'
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});



async function viewStatus() {
  let authData = loadJson(AUTH_FILE);
  if (!authData || !authData.access_token) {
    console.log('\nNot authenticated. Please run the chatbot and type /login first.\n');
    return;
  }

  console.log('\nFetching account details...\n');

  try {
    let response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': `Bearer ${authData.access_token}`
      }
    });

    if (response.status === 401) {
      console.log('Token expired. Refreshing automatically in the background...');
      try {
        authData = await refreshAuthToken(authData);
        response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            'Authorization': `Bearer ${authData.access_token}`
          }
        });
      } catch (e) {
        console.log(`\nFailed to refresh token: ${e.message}. Please type /login in the chatbot.\n`);
        return;
      }
    }

    if (!response.ok) {
      console.log(`Failed to fetch user info (${response.status}).`);
      return;
    }

    const userData = await response.json();
    
    console.log('=== Architecture Config Status ===');
    console.log(`Account Email: ${userData.email}`);
    console.log(`Account Name:  ${userData.name}`);
    console.log(`Project ID:    ${authData.projectId || 'Unknown (fallback applied)'}`);
    
    const configData = loadJson(CONFIG_FILE) || {};
    console.log(`Current Model: ${configData.model || 'claude-opus-4-6-thinking'}`);
    console.log('==================================\n');
  } catch (err) {
    console.error('Network error while fetching status:', err.message);
  }
}

function changeModel() {
  const configData = loadJson(CONFIG_FILE) || {};
  const current = configData.model || 'claude-opus-4-6-thinking';
  
  console.log('\n--- Available Models ---');
  AVAILABLE_MODELS.forEach((model, index) => {
    const isCurrent = model === current ? ' (Current)' : '';
    console.log(`${index + 1}. ${model}${isCurrent}`);
  });
  console.log('------------------------');

  rl.question(`\nEnter the number of the model you want to use (1-${AVAILABLE_MODELS.length}), or press Enter to cancel: `, (answer) => {
    const selection = parseInt(answer.trim(), 10);
    
    if (!isNaN(selection) && selection >= 1 && selection <= AVAILABLE_MODELS.length) {
      const newModel = AVAILABLE_MODELS[selection - 1];
      configData.model = newModel;
      saveJson(CONFIG_FILE, configData);
      console.log(`\nSuccess! Model has been permanently set to: ${newModel}\n`);
    } else {
      console.log('\nModel change cancelled or invalid selection.\n');
    }
    showMenu();
  });
}

function showMenu() {
  console.log('--- Antigravity Configuration Menu ---');
  console.log('1. View architecture status (Gmail, Project, Model)');
  console.log('2. Change default model');
  console.log('3. Exit');
  console.log('--------------------------------------');
  
  rl.question('Select an option (1-3): ', async (answer) => {
    switch (answer.trim()) {
      case '1':
        await viewStatus();
        showMenu();
        break;
      case '2':
        changeModel(); // changeModel will call showMenu when done
        break;
      case '3':
        console.log('Exiting configuration tool.');
        process.exit(0);
        break;
      default:
        console.log('\nInvalid option. Please enter 1, 2, or 3.\n');
        showMenu();
        break;
    }
  });
}

console.log('\nWelcome to the Antigravity Configuration CLI!\n');
showMenu();
