// @flow

import React, { Component } from 'react';
import { AsyncStorage, ScrollView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { withNavigation } from 'react-navigation';
import { withContext } from '../../Context';
import type { ContextType } from '../../Context';

import Header from '../../components/common/Header';
import Button from '../../components/Button';
import Input from '../../components/Input';
import RegisterMutation from './RegisterEmailMutation';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { IMAGES } from '../../utils/design/images';
import { ROUTENAMES } from '../../navigation/RouteNames';
import GradientWrapper from '../../components/GradientWrapper';

const ForgotButton = styled.TouchableOpacity``;

const ForgotText = styled.Text`
  color: ${props => props.theme.colors.secondaryColor};
  font-weight: bold;
  font-size: 20px;
  text-align: right;
`;

const TextWrapper = styled.View`
  flex: 3;
`;

const BigText = styled.Text`
  color: ${props => props.theme.colors.secondaryColor};
  font-size: 36px;
  font-weight: bold;
  padding: 20px 0 20px 0;
`;

const ButtonsWrapper = styled.View`
  flex: 1;
  position: absolute;
  bottom: 20;
  left: 20;
  right: 20;
`;

const ButtonText = styled.Text`
  color: ${props => (!props.error ? props.theme.colors.primaryColor : props.theme.colors.errorViewColor)};
  font-size: 24px;
  font-weight: bold;
`;

const Arrow = styled.Image.attrs({
  source: IMAGES.ARROW,
})`
  width: 30;
  height: 24;
  margin-top: 5;
  tint-color: ${props => props.theme.colors.secondaryColor};
`;

const KeyboardWrapper = styled.KeyboardAvoidingView.attrs({
  enabled: true,
  behavior: Platform.OS === 'ios' ? 'padding' : 'height',
})`
  flex: 1;
`;

type Props = {
  navigation: Object,
  context: ContextType,
};

type State = {
  name: string,
  email: string,
  password: string,
  errorText: string,
};

class RegisterScreen extends Component<Props, State> {
  state = {
    name: '',
    email: '',
    password: '',
    errorText: '',
  };

  handleRegisterPress = async () => {
    const { name, email, password } = this.state;
    const { navigation, context } = this.props;

    if (!name || !email || !password) {
      context.openModal('Preencha todos os campos!');
    }

    const input = {
      name,
      email,
      password,
    };

    const onCompleted = async res => {
      const response = res && res.RegisterEmail;
      const token = response && response.token;
      if (response && response.error) {
        return context.openModal(response.error);
      } else if (token) {
        this.props.context.openSuccessModal('Você cadastrou com sucesso');
        await AsyncStorage.setItem('token', token);
        navigation.navigate(ROUTENAMES.LOGGED_APP);
      }
    };

    const onError = () => {
      return context.openModal('Verifique sua conexão com a internet e tente novamente');
    };

    RegisterMutation.commit(input, onCompleted, onError);
  };

  render() {
    const { navigation, context } = this.props;
    const { errorText } = context;

    return (
      <KeyboardWrapper>
        <GradientWrapper error={errorText ? true : false}>
          <Header>
            <ForgotButton onPress={() => navigation.pop()}>
              <Arrow />
            </ForgotButton>
            <ForgotButton onPress={() => navigation.navigate(ROUTENAMES.LOGIN)}>
              <ForgotText>Login</ForgotText>
            </ForgotButton>
          </Header>
          <ScrollView>
            <TextWrapper>
              <BigText>Create an Account</BigText>
              <Input placeholder="Name" autoCorrect={false} onChangeText={text => this.setState({ name: text })} />
              <Input placeholder="Email" autoCorrect={false} onChangeText={text => this.setState({ email: text })} />
              <Input
                placeholder="Password"
                autoCorrect={false}
                secureTextEntry
                onChangeText={text => this.setState({ password: text })}
              />
            </TextWrapper>
            <KeyboardSpacer />
          </ScrollView>
          <ButtonsWrapper>
            <Button fill onPress={this.handleRegisterPress}>
              <ButtonText error={errorText ? true : false}>Create an Account</ButtonText>
            </Button>
          </ButtonsWrapper>
        </GradientWrapper>
      </KeyboardWrapper>
    );
  }
}

export default withContext(withNavigation(RegisterScreen));
