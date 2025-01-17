import React, { useState} from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList() {
    const [ isfiltersVisible, setIsFiltersVisible ] = useState(false);
    const [ subject, setSubject ] = useState('');
    const [ week_day, setWeekDay] = useState('');
    const [ time, setTime ] = useState('');
    const [ teachers, setTeachers ] = useState([]);

    const [ favorites, setFavorites ] = useState<number[]>([]);

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then( response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id;
                });
                setFavorites(favoritedTeachersIds);
            }
        });

    }

    useFocusEffect(
        React.useCallback(() => {
          loadFavorites();
        }, [])
    );

    function handleToggleFiltersVisible() {
        setIsFiltersVisible(!isfiltersVisible);
    };

    async function handleFiltersSubmit() {
        loadFavorites();

        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time,
            }
        });

        console.log(response.data);

        setTeachers(response.data);
        setIsFiltersVisible(!isfiltersVisible);
    };

    return (

        <View style={styles.container}>
            <PageHeader 
            title="Proffys disponíveis" 
            headerRight={(
                <BorderlessButton onPress={handleToggleFiltersVisible}>
                    <Feather name="filter" size={20} color="#FFF" />
                </BorderlessButton>
            )}>
                
                {isfiltersVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput style={styles.input} 
                            placeholderTextColor="#B2B2B2" 
                            placeholder="Qual a matéria?" 
                            value={subject}
                            onChangeText={text => setSubject(text)} />

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput style={styles.input} 
                                    placeholderTextColor="#B2B2B2" 
                                    placeholder="Qual o dia?" 
                                    value={week_day}
                                    onChangeText={text => setWeekDay(text)} /> 
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput style={styles.input} 
                                    placeholderTextColor="#B2B2B2" 
                                    placeholder="Qual o horário?" 
                                    value={time}
                                    onChangeText={text => setTime(text)} /> 
                            </View>
                        </View>

                        <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>

            <ScrollView 
                style={styles.teacherList} 
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
            }}>

                {teachers.map( (teacher: Teacher) => {
                    return (
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                        />
                    )
                })}
                
            </ScrollView>
        </View>
    );
}

export default TeacherList;