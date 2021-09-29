package csci310;


import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;



public class SQLConnect {
	public static int currentUserId = -1;
	static boolean successfullyConnected = false;
	static boolean successfullyRetrieved = false;
	static Connection connection = null;
	static boolean userAdded;
	static boolean stockAdded = false;
	static boolean stockDeleted = false;
	static boolean displayedAll = false;
	static String databaseLocation = "jdbc:sqlite:sample.db";
	static boolean longHex = false;
	
	public static void initConnection() {
		
		//we already made a connection
		if (connection != null) {
			System.out.println("[WARN] Connection has already been established");
			successfullyConnected = true;
			
			/*if(!databaseLocation.equals("")) {
				return;
			}*/
			return;
		}
		Statement statement = null;
		
		try {
			connection = DriverManager.getConnection("jdbc:sqlite:sample.db");
			String UserRegistrytable = "CREATE TABLE IF NOT EXISTS UserRegistry (" 
					+ "userID INTEGER PRIMARY KEY AUTOINCREMENT," 
					+ "username TEXT NOT NULL UNIQUE,"  
					+ "pw VARCHAR TEXT NOT NULL" 
					+ ");";
			System.out.println("Connection established");
			
			String PortfolioTable = "CREATE TABLE IF NOT EXISTS Portfolio(" 
					+"userID INTEGER NOT NULL," 
					+"tickerSymbol TEXT NOT NULL," 
					+ "quantity INTEGER NOT NULL," 
					+"dateSold TEXT NULL," 
					+"datePurchased TEXT NOT NULL," 
					+"FOREIGN KEY (userID) REFERENCES UserRegistry(userID)" 
					+");";
			/*if (databaseLocation.equals("")) {
				UserRegistrytable = "";
			}*/
			statement = connection.createStatement();
			statement.execute(UserRegistrytable);
			statement.execute(PortfolioTable);
			successfullyConnected = true;
		} catch (Exception e) {
			//System.out.println("Exception in init");
			//successfullyConnected = false;
			//e.printStackTrace();
		} 
	}
	
	public static ArrayList<Map<String,String>> retrieveStock() {
		
		
		ArrayList<Map<String,String>> portfolio = new ArrayList<Map<String,String>>();
		
		
		try {
			PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM Portfolio WHERE userId = ?");
			
			
			if (SQLConnect.currentUserId == -1) {
				preparedStatement.setInt(0,currentUserId);
			}
			preparedStatement.setInt(1,currentUserId);

			ResultSet resultSet = preparedStatement.executeQuery();
			
			while(resultSet.next()) {
				String ticker = resultSet.getString("tickerSymbol");
				String quantity = resultSet.getString("quantity");
				String dateSold = resultSet.getString("dateSold");
				String datePurchased = resultSet.getString("datePurchased");;
				
				
				Map<String,String> stockDetail = new HashMap<String,String>();
				stockDetail.put("ticker",ticker);
				stockDetail.put("quantity",quantity);
				stockDetail.put("dateSold",dateSold);
				stockDetail.put("datePurchased",datePurchased);

				portfolio.add(stockDetail);

			}
			
			preparedStatement.close();
			successfullyRetrieved = true;
			
			
		} catch (Exception e) {
			successfullyRetrieved = false;
		}
		
		return portfolio;
	}
	
	public static String toHex(byte[] array) throws NoSuchAlgorithmException {
		BigInteger bi = new BigInteger(1, array);
        String hex = bi.toString(16);
        int paddingLength = (array.length * 2) - hex.length();
        if(paddingLength > 0)
        {
            return String.format("%0"  +paddingLength + "d", 0) + hex;
        }
        else{
        	longHex = true;
        	return hex;
        }
    }
	
	public static byte[] fromHex(String hex) throws NoSuchAlgorithmException {
        byte[] bytes = new byte[hex.length() / 2];
        for(int i = 0; i<bytes.length ;i++)
        {
            bytes[i] = (byte)Integer.parseInt(hex.substring(2 * i, 2 * i + 2), 16);
        }
        return bytes;
    }
	
	public static boolean validatePassword(String originalPassword, String storedPassword) throws NoSuchAlgorithmException, InvalidKeySpecException {
        String[] parts = storedPassword.split(":");
        int iterations = Integer.parseInt(parts[0]);
        byte[] salt = fromHex(parts[1]);
        byte[] hash = fromHex(parts[2]);
         
        PBEKeySpec spec = new PBEKeySpec(originalPassword.toCharArray(), salt, iterations, hash.length * 8);
        SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
        byte[] testHash = skf.generateSecret(spec).getEncoded();
         
        int diff = hash.length ^ testHash.length;
        System.out.println("hash length: " + hash.length + " testHash length: "+ testHash.length);
        for(int i = 0; i < hash.length; i++)
        {
            diff |= hash[i] ^ testHash[i];
        }
        return diff == 0;
    }
	
	public static String generateStrongPassword(String password) throws NoSuchAlgorithmException, InvalidKeySpecException {
		int iterations = 1000;
		
		SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
		byte[] salt = new byte[16];
		random.nextBytes(salt);
		
		PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, iterations, 64*8);
		SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
		byte[] hash = factory.generateSecret(spec).getEncoded();
		return iterations + ":" + toHex(salt) + ":" + toHex(hash);
	}
	

	public static String addUser(String username, String password) {
		PreparedStatement ps1 = null;
		PreparedStatement ps2 = null;
		
		String message = "That username already exists, try again.";
		try {
			// To test if they were then added
			/*ps2 = connection.prepareStatement("DELETE FROM UserRegistry");
			ps2.setString(1, username);
			ps2.executeUpdate();*/
			
			String securePassword = generateStrongPassword(password);
			
			System.out.println("username: " + username + " password: " + password + " secure password: " + securePassword);

			ps1 = connection.prepareStatement("INSERT INTO UserRegistry (username, pw) VALUES (?, ?)");
			ps1.setString(1, username);
			ps1.setString(2, securePassword);
			
			ps1.executeUpdate();
			userAdded = true;
			message = "Success";
		}
		catch(SQLException sqe) {
			System.out.println(sqe.getMessage());
			userAdded = false;
		}
		catch(NoSuchAlgorithmException nsae) {
			//userAdded = false;
		}
		catch(InvalidKeySpecException ikse) {
			//userAdded = false;
		}
		return message;
		
	}
	
	public static String retrieveUser(String username) throws SQLException {
		PreparedStatement ps = null;
		
		ps = connection.prepareStatement("SELECT * FROM UserRegistry WHERE username =?");
		ps.setString(1, username);
		
		
		ResultSet rs = ps.executeQuery();
		
		if(!rs.isBeforeFirst()) {
			return "empty";
		}
		else {
			return rs.getString("username");
		}
			
		
	}
	
	public static String login(String username, String password) {
		PreparedStatement ps = null;
		String next = "";
		try {
			
			ps = connection.prepareStatement("SELECT * FROM UserRegistry WHERE username =?");
			ps.setString(1, username);
			//ps.setString(2, securePassword);
			
			ResultSet rs = ps.executeQuery();
			
			
			if(rs.next()) {
				//Sign in successful-can only ever be one
				String securePassword = rs.getString("pw");
				boolean matched = validatePassword(password, securePassword);
				if(matched) {
					next = "SamplePortfolioPage.jsp";
					currentUserId = Integer.parseInt(rs.getString("userID"));
					System.out.println(currentUserId);
				} 
				// User exists but wrong password
				else {
					next = "login.jsp";
				}
			}
			//User does not exist
			else {
				next = "login.jsp";
			}
		}
		catch(SQLException sqle) {
			//next = "login.jsp";
		}
		catch(NoSuchAlgorithmException nsae) {
			//next = "login.jsp";
		}
		catch(InvalidKeySpecException ikse) {
			//next = "login.jsp";
		}
		
		return next;
	}
	
	public static int displayAllUsers() throws SQLException {
		PreparedStatement ps = null;
		int count = 0;
	
			ps = connection.prepareStatement("SELECT * FROM UserRegistry");
			ResultSet rs = ps.executeQuery();
			System.out.println("Displaying all users:");
			while(rs.next()) {
				System.out.println("username: " + rs.getString("username") + " password: " + rs.getString("pw"));
				count++;
			}
		
		return count;
	}
	
	
	
	public static void addStocks(String tickerSymbol, int quantity, String dateSold, String datePurchased) {
		
		stockAdded = true;
		try {
			PreparedStatement preparedStatement = connection.prepareStatement("INSERT into Portfolio(userID,tickerSymbol,quantity,dateSold,datePurchased) VALUES (?,?,?,?,?)");
			
			
			/*if (SQLConnect.currentUserId == -1) {
				preparedStatement.setInt(0,currentUserId);
			}*/
			preparedStatement.setInt(1,currentUserId);
			preparedStatement.setString(2, tickerSymbol);
			preparedStatement.setInt(3, quantity);
			preparedStatement.setString(4, dateSold);
			preparedStatement.setString(5, datePurchased);
			
			preparedStatement.execute();
			preparedStatement.close();
		} catch(Exception e) {
			//System.out.println("Exception in addStocks SQL");
			//stockAdded = false;
		}
	}
	
	public static void deleteStock(String tickerSymbol, int quantity, String dateSold, String datePurchased) {
		stockDeleted = true;
		
		try {
			PreparedStatement preparedStatement = connection.prepareStatement("DELETE FROM Portfolio WHERE userId =? AND tickerSymbol =? AND quantity =? AND dateSold =? AND datePurchased =?");
			
			preparedStatement.setInt(1,currentUserId);
			preparedStatement.setString(2, tickerSymbol);
			preparedStatement.setInt(3, quantity);
			preparedStatement.setString(4, dateSold);
			preparedStatement.setString(5, datePurchased);
			
			preparedStatement.execute();
			preparedStatement.close();
		} catch(Exception e) {
			
		}
	}
}
