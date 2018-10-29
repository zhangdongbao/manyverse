/**
 * Manyverse is a mobile app for Secure Scuttlebutt networks
 *
 * Copyright (C) 2017 Andre 'Staltz' Medeiros
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const test = require('tape');

module.exports = function(driver, t) {
  t.test('Connections tab can create DHT invites', async function(t) {
    const connectionsTabButton = await driver.elementByAndroidUIAutomator(
      'new UiSelector().descriptionContains("Connections Tab Button")',
    );
    t.ok(connectionsTabButton, 'I see the Connections Tab button');
    await connectionsTabButton.tap();
    t.pass('I tap it');

    t.ok(
      await driver.elementByAndroidUIAutomator(
        'new UiSelector().text("Connections")',
      ),
      'I see the Connections header in the Central screen',
    );
    t.ok(
      await driver.elementByAndroidUIAutomator(
        'new UiSelector().textContains("No connections")',
      ),
      'I see Connections tab body with no connections',
    );

    const fab = await driver.elementByAndroidUIAutomator(
      'new UiSelector().descriptionContains("Floating Action Button")',
      6000,
    );
    t.ok(fab, 'I see the Floating Action Button');
    await fab.tap();
    t.pass('I tap it');

    const createInviteButton = await driver.elementByAndroidUIAutomator(
      'new UiSelector().textContains("Create invite")',
      6000,
    );
    t.ok(createInviteButton, 'I see the Create Invite Button');
    await createInviteButton.tap();
    t.pass('I tap it');

    const inviteCode = await driver.elementByAndroidUIAutomator(
      'new UiSelector().descriptionContains("Invite Code")',
      6000,
    );
    const inviteCodeText = await inviteCode.text();
    t.ok(inviteCodeText.length > 70, 'I see the Invite Code');

    await driver.back();
    t.pass('I press the (hardware) back button');

    t.ok(
      await driver.elementByAndroidUIAutomator(
        'new UiSelector().textContains("Internet P2P: waiting for online friend")',
      ),
      'I see Connections tab body with a staged connection',
    );

    t.ok(
      await driver.elementByAndroidUIAutomator(
        `new UiSelector().textContains("${inviteCodeText.substr(4, 10)}")`,
      ),
      'I see that the staged connection refers to the invite code',
    );

    t.end();
  });

  t.test('Connections tab can add note to DHT invite', async function(t) {
    const invite = await driver.elementByAndroidUIAutomator(
      'new UiSelector().textContains("waiting for online friend")',
    );
    t.ok(invite, 'I see a staged connection for the invite code');
    await invite.tap();
    t.pass('I tap it');

    const addNote = await driver.waitForElementByAndroidUIAutomator(
      'new UiSelector().textContains("Add note")',
      6000,
    );
    t.ok(addNote, 'I see a slide-in menu with "Add note" option');
    await addNote.tap();
    t.pass('I tap it');

    await driver.sleep(2000);

    t.ok(
      await driver.elementByAndroidUIAutomator(
        'new UiSelector().textContains("note about this invite code")',
      ),
      'I see a dialog prompt asking for the note',
    );
    t.pass('I write a note into the text field');
    await driver.keys('notehere');

    const okButton = await driver.waitForElementByAndroidUIAutomator(
      'new UiSelector().text("Add")',
      6000,
    );
    t.ok(okButton, 'I see the Add button');
    await okButton.tap();
    t.pass('I tap it');

    t.ok(
      await driver.waitForElementByAndroidUIAutomator(
        'new UiSelector().textContains("notehere")',
        6000,
      ),
      'I see the note for the invite code',
    );

    t.end();
  });

  t.test('Connections tab can delete DHT invite', async function(t) {
    const invite = await driver.waitForElementByAndroidUIAutomator(
      'new UiSelector().textContains("waiting for online friend")',
      6000,
    );
    t.ok(invite, 'I see a staged connection for the invite code');
    await invite.tap();
    t.pass('I tap it');

    const addNote = await driver.waitForElementByAndroidUIAutomator(
      'new UiSelector().textContains("Delete")',
      6000,
    );
    t.ok(addNote, 'I see a slide-in menu with "Delete" option');
    await addNote.tap();
    t.pass('I tap it');

    await driver.sleep(2000);

    t.ok(
      await driver.waitForElementByAndroidUIAutomator(
        'new UiSelector().textContains("No connections")',
        6000,
      ),
      'I see Connections tab body with no connections',
    );

    t.end();
  });

  t.test('Connections tab changes to Public Tab', async function(t) {
    const publicTabButton = await driver.elementByAndroidUIAutomator(
      'new UiSelector().descriptionContains("Public Tab Button")',
    );
    t.ok(publicTabButton, 'I see Public Tab button');
    await publicTabButton.tap();
    t.pass('I tap it');

    t.end();
  });
};
