import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

// Remember to rename these classes and interfaces!

interface FileNameContentSyncPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: FileNameContentSyncPluginSettings = {
	mySetting: 'default'
}

export default class FileNameContentSyncPlugin extends Plugin {
	settings: FileNameContentSyncPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerEvent(
			this.app.vault.on('modify', (file) => {
				// if (this.settings.useFileSaveHook) {
				//   return this.handleSyncHeadingToFile(file);
				// }
			}),
		);

		this.registerEvent(
			this.app.workspace.on('file-open', async (file) => {
				if (!file) return
				let text = await this.app.vault.read(file);
				console.log(text)
				// if (this.settings.useFileOpenHook && file !== null) {
				//   return this.handleSyncFilenameToHeading(file, file.path);
				// }
			}),
		);

		this.registerEvent(
			this.app.vault.on('modify', async (file: TFile) => {
				if (!file) return
				let text = await this.app.vault.read(file as TFile);
				const title = text.split('\n')[0]
				if (title) {
					const newPath = `${file?.parent?.path}/${title}.md`;
					await this.app.fileManager.renameFile(file, newPath);
				}
				// if (this.settings.useFileSaveHook) {
				//   return this.handleSyncHeadingToFile(file);
				// }
			}),
		);

		this.addSettingTab(new ileNameContentSyncTab(this.app, this));

	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}



class ileNameContentSyncTab extends PluginSettingTab {
	plugin: FileNameContentSyncPlugin;

	constructor(app: App, plugin: FileNameContentSyncPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
