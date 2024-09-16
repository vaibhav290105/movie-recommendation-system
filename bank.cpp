#include <iostream>
#include <vector>
#include <string>

using namespace std;

// Bank Account class
class BankAccount {
private:
    string accountHolderName;
    int accountNumber;
    double balance;

public:
    // Constructor to initialize account
    BankAccount(string name, int accNo, double initialDeposit) {
        accountHolderName = name;
        accountNumber = accNo;
        balance = initialDeposit;
    }

    // Function to deposit money
    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            cout << "Amount Deposited: " << amount << endl;
        } else {
            cout << "Invalid amount. Deposit failed." << endl;
        }
    }

    // Function to withdraw money
    void withdraw(double amount) {
        if (amount <= balance && amount > 0) {
            balance -= amount;
            cout << "Amount Withdrawn: " << amount << endl;
        } else {
            cout << "Insufficient balance or invalid amount." << endl;
        }
    }

    // Function to display account details
    void displayAccountDetails() const {
        cout << "Account Holder Name: " << accountHolderName << endl;
        cout << "Account Number: " << accountNumber << endl;
        cout << "Balance: $" << balance << endl;
    }

    // Function to check balance
    double checkBalance() const {
        return balance;
    }

    // Function to get account number
    int getAccountNumber() const {
        return accountNumber;
    }
};

// Bank class to manage multiple accounts
class Bank {
private:
    vector<BankAccount> accounts;

public:
    // Function to create a new account
    void createAccount(string name, int accNo, double initialDeposit) {
        BankAccount newAccount(name, accNo, initialDeposit);
        accounts.push_back(newAccount);
        cout << "Account Created Successfully!" << endl;
    }

    // Function to find an account by account number
    BankAccount* findAccount(int accNo) {
        for (auto& account : accounts) {
            if (account.getAccountNumber() == accNo) {
                return &account;
            }
        }
        return nullptr;
    }

    // Function to deposit money into an account
    void depositToAccount(int accNo, double amount) {
        BankAccount* account = findAccount(accNo);
        if (account != nullptr) {
            account->deposit(amount);
        } else {
            cout << "Account not found!" << endl;
        }
    }

    // Function to withdraw money from an account
    void withdrawFromAccount(int accNo, double amount) {
        BankAccount* account = findAccount(accNo);
        if (account != nullptr) {
            account->withdraw(amount);
        } else {
            cout << "Account not found!" << endl;
        }
    }

    // Function to display account details
    void displayAccountDetails(int accNo) {
        BankAccount* account = findAccount(accNo);
        if (account != nullptr) {
            account->displayAccountDetails();
        } else {
            cout << "Account not found!" << endl;
        }
    }
};

// Main function
int main() {
    Bank myBank;
    int choice, accNo;
    string name;
    double amount;

    do {
        cout << "\n==== Bank Management System ====" << endl;
        cout << "1. Create Account" << endl;
        cout << "2. Deposit Money" << endl;
        cout << "3. Withdraw Money" << endl;
        cout << "4. Check Account Details" << endl;
        cout << "5. Exit" << endl;
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
        case 1:
            cout << "Enter Account Holder Name: ";
            cin >> name;
            cout << "Enter Account Number: ";
            cin >> accNo;
            cout << "Enter Initial Deposit: ";
            cin >> amount;
            myBank.createAccount(name, accNo, amount);
            break;

        case 2:
            cout << "Enter Account Number: ";
            cin >> accNo;
            cout << "Enter Deposit Amount: ";
            cin >> amount;
            myBank.depositToAccount(accNo, amount);
            break;

        case 3:
            cout << "Enter Account Number: ";
            cin >> accNo;
            cout << "Enter Withdrawal Amount: ";
            cin >> amount;
            myBank.withdrawFromAccount(accNo, amount);
            break;

        case 4:
            cout << "Enter Account Number: ";
            cin >> accNo;
            myBank.displayAccountDetails(accNo);
            break;

        case 5:
            cout << "Thank you for using the Bank Management System!" << endl;
            break;

        default:
            cout << "Invalid choice. Please try again." << endl;
        }
    } while (choice != 5);

    return 0;
} 
